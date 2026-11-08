"""design 폴더의 턴어라운드 GIF로 에이전트를 이름과 GIF만 등록한다. 이미 있는 이름은 건너뛴다.

실행: python scripts/seed_agents.py [GIF가 있는 폴더]
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from portfolio_api import db, repository  # noqa: E402

DEFAULT_DIR = Path(r"D:\workspace\design")


def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DIR
    for gif in sorted(source.glob("*.gif")):
        name = gif.stem.split("_")[0]
        if db.fetch_one("select 1 as ok from public.agents where name = %s", (name,)):
            print(f"건너뜀(이미 있음): {name}")
            continue
        agent = repository.create_agent({"name": name})
        repository.set_turnaround(agent["id"], gif.read_bytes(), gif.name)
        print(f"등록: {name} (id={agent['id']}) <- {gif.name}")


if __name__ == "__main__":
    main()
