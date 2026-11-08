"""업로드 파일 검증과 local/media 저장·삭제."""

import io
import uuid

from PIL import Image, UnidentifiedImageError

from . import config


class MediaError(ValueError):
    """업로드 파일이 허용 조건에 맞지 않을 때."""


PHOTO_FORMATS = {"JPEG": ("jpg", "image/jpeg"), "PNG": ("png", "image/png"), "WEBP": ("webp", "image/webp")}


def _open(data):
    if not data:
        raise MediaError("파일이 비어 있습니다.")
    if len(data) > config.MAX_UPLOAD_BYTES:
        raise MediaError("파일 크기는 20MB 이하여야 합니다.")
    try:
        Image.open(io.BytesIO(data)).verify()
        return Image.open(io.BytesIO(data))
    except (UnidentifiedImageError, OSError):
        raise MediaError("이미지 파일이 아닙니다.") from None


def _write(relative, data):
    target = config.MEDIA_ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)


def save_gif(agent_id, data):
    image = _open(data)
    if image.format != "GIF":
        raise MediaError("턴어라운드는 GIF 파일만 올릴 수 있습니다.")
    relative = f"turnaround/{agent_id}-{uuid.uuid4().hex}.gif"
    _write(relative, data)
    return {"object_path": relative, "thumb_path": None, "mime_type": "image/gif",
            "size_bytes": len(data), "width": image.width, "height": image.height}


def save_photo(agent_id, data):
    image = _open(data)
    if image.format not in PHOTO_FORMATS:
        raise MediaError("사진은 JPEG, PNG, WebP 파일만 올릴 수 있습니다.")
    extension, mime = PHOTO_FORMATS[image.format]
    name = uuid.uuid4().hex
    relative = f"photos/{agent_id}/{name}.{extension}"
    thumb_relative = f"photos/{agent_id}/{name}.thumb.webp"
    thumb = image.convert("RGB")
    thumb.thumbnail((config.THUMB_SIZE, config.THUMB_SIZE))
    buffer = io.BytesIO()
    thumb.save(buffer, "WEBP", quality=82)
    _write(relative, data)
    _write(thumb_relative, buffer.getvalue())
    return {"object_path": relative, "thumb_path": thumb_relative, "mime_type": mime,
            "size_bytes": len(data), "width": image.width, "height": image.height}


def resolve(relative, must_exist=True):
    """local/media 안의 파일 경로만 돌려준다. 밖으로 나가는 경로는 None."""
    root = config.MEDIA_ROOT.resolve()
    target = (root / relative).resolve()
    if root not in target.parents:
        return None
    if must_exist and not target.is_file():
        return None
    return target


def remove(paths):
    for relative in paths:
        target = resolve(relative, must_exist=False) if relative else None
        if target:
            target.unlink(missing_ok=True)
