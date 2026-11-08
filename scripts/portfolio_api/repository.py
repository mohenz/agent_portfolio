"""에이전트·사진 저장 계층."""

from . import db, media

TEXT_FIELDS = ("name", "nationality", "occupation", "role", "shoe_size")
INT_FIELDS = ("age", "height_cm", "bust_cm", "waist_cm", "hip_cm")
FIELDS = TEXT_FIELDS + INT_FIELDS


class ValidationError(ValueError):
    """요청 값이 올바르지 않을 때."""


class NotFound(LookupError):
    """대상이 없을 때."""


AGENT_SELECT = """
select a.id, a.name, a.age, a.nationality, a.occupation, a.role,
       a.height_cm, a.bust_cm, a.waist_cm, a.hip_cm, a.shoe_size,
       m.object_path as turnaround_path, m.width as turnaround_width, m.height as turnaround_height,
       (select count(*) from public.agent_photos p where p.agent_id = a.id) as photo_count
from public.agents a
left join public.media_assets m on m.id = a.turnaround_asset_id
"""


def _clean(data, require_name):
    values = {}
    for field in FIELDS:
        if field not in data:
            continue
        raw = data[field]
        if raw is None or (isinstance(raw, str) and not raw.strip()):
            values[field] = None
        elif field in INT_FIELDS:
            try:
                number = int(raw)
            except (TypeError, ValueError):
                raise ValidationError("숫자 항목에 숫자가 아닌 값이 들어 있습니다.") from None
            if number < 0 or number > 1000:
                raise ValidationError("숫자 항목의 값이 범위를 벗어났습니다.")
            values[field] = number
        else:
            values[field] = str(raw).strip()
    if (require_name or "name" in values) and not values.get("name"):
        raise ValidationError("이름을 입력해 주세요.")
    return values


def list_agents():
    return db.fetch_all(AGENT_SELECT + " order by a.id")


def get_agent(agent_id):
    agent = db.fetch_one(AGENT_SELECT + " where a.id = %s", (agent_id,))
    if not agent:
        raise NotFound("에이전트를 찾을 수 없습니다.")
    agent["photos"] = db.fetch_all(
        """select p.id, m.object_path, m.thumb_path, m.width, m.height
           from public.agent_photos p join public.media_assets m on m.id = p.asset_id
           where p.agent_id = %s order by p.sort_order, p.id""",
        (agent_id,),
    )
    return agent


def create_agent(data):
    values = _clean(data, require_name=True)
    columns = ", ".join(values)
    placeholders = ", ".join(["%s"] * len(values))
    row = db.fetch_one(
        f"insert into public.agents ({columns}) values ({placeholders}) returning id", tuple(values.values())
    )
    return get_agent(row["id"])


def update_agent(agent_id, data):
    values = _clean(data, require_name=False)
    if values:
        assignments = ", ".join(f"{field} = %s" for field in values)
        row = db.fetch_one(
            f"update public.agents set {assignments}, updated_at = now() where id = %s returning id",
            (*values.values(), agent_id),
        )
        if not row:
            raise NotFound("에이전트를 찾을 수 없습니다.")
    return get_agent(agent_id)


def _insert_asset(conn, info, original_name):
    return conn.execute(
        """insert into public.media_assets
             (object_path, thumb_path, original_name, mime_type, size_bytes, width, height)
           values (%(object_path)s, %(thumb_path)s, %(original_name)s, %(mime_type)s,
                   %(size_bytes)s, %(width)s, %(height)s) returning id""",
        {**info, "original_name": original_name},
    ).fetchone()["id"]


def _paths(rows):
    return [p for row in rows for p in (row["object_path"], row["thumb_path"])]


def delete_agent(agent_id):
    with db.connect() as conn:
        with conn.transaction():
            row = conn.execute("select turnaround_asset_id from public.agents where id = %s", (agent_id,)).fetchone()
            if not row:
                raise NotFound("에이전트를 찾을 수 없습니다.")
            asset_ids = [r["asset_id"] for r in conn.execute(
                "select asset_id from public.agent_photos where agent_id = %s", (agent_id,)).fetchall()]
            if row["turnaround_asset_id"]:
                asset_ids.append(row["turnaround_asset_id"])
            conn.execute("delete from public.agents where id = %s", (agent_id,))
            removed = conn.execute(
                "delete from public.media_assets where id = any(%s) returning object_path, thumb_path", (asset_ids,)
            ).fetchall()
    media.remove(_paths(removed))


def _require_agent(agent_id):
    if not db.fetch_one("select 1 as ok from public.agents where id = %s", (agent_id,)):
        raise NotFound("에이전트를 찾을 수 없습니다.")


def set_turnaround(agent_id, data, original_name):
    _require_agent(agent_id)
    info = media.save_gif(agent_id, data)
    removed = []
    try:
        with db.connect() as conn:
            with conn.transaction():
                old = conn.execute("select turnaround_asset_id from public.agents where id = %s", (agent_id,)).fetchone()
                asset_id = _insert_asset(conn, info, original_name)
                conn.execute("update public.agents set turnaround_asset_id = %s, updated_at = now() where id = %s",
                             (asset_id, agent_id))
                if old["turnaround_asset_id"]:
                    removed = conn.execute(
                        "delete from public.media_assets where id = %s returning object_path, thumb_path",
                        (old["turnaround_asset_id"],)).fetchall()
    except Exception:
        media.remove([info["object_path"]])
        raise
    media.remove(_paths(removed))
    return get_agent(agent_id)


def add_photo(agent_id, data, original_name):
    _require_agent(agent_id)
    info = media.save_photo(agent_id, data)
    try:
        with db.connect() as conn:
            with conn.transaction():
                asset_id = _insert_asset(conn, info, original_name)
                conn.execute(
                    """insert into public.agent_photos (agent_id, asset_id, sort_order)
                       values (%s, %s, coalesce((select max(sort_order) + 1 from public.agent_photos
                                                 where agent_id = %s), 0))""",
                    (agent_id, asset_id, agent_id))
    except Exception:
        media.remove([info["object_path"], info["thumb_path"]])
        raise
    return get_agent(agent_id)


def delete_photo(photo_id):
    with db.connect() as conn:
        with conn.transaction():
            row = conn.execute("delete from public.agent_photos where id = %s returning asset_id, agent_id",
                               (photo_id,)).fetchone()
            if not row:
                raise NotFound("사진을 찾을 수 없습니다.")
            removed = conn.execute(
                "delete from public.media_assets where id = %s returning object_path, thumb_path",
                (row["asset_id"],)).fetchall()
    media.remove(_paths(removed))
    return get_agent(row["agent_id"])
