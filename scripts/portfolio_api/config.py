"""환경변수와 경로 설정. 최하위 계층이므로 패키지 내 다른 모듈을 import 하지 않는다."""

import os
from pathlib import Path

ENV = {
    "PGHOST": os.getenv("PGHOST", "127.0.0.1"),
    "PGPORT": os.getenv("PGPORT", "54329"),
    "PGUSER": os.getenv("PGUSER", "postgres"),
    "PGPASSWORD": os.getenv("PGPASSWORD", ""),
    "PGDATABASE": os.getenv("PGDATABASE", "agent_portfolio"),
}

API_HOST = os.getenv("PORTFOLIO_API_HOST", "127.0.0.1")
API_PORT = int(os.getenv("PORTFOLIO_API_PORT", "3052"))

# scripts/portfolio_api/config.py -> scripts/portfolio_api -> scripts -> 프로젝트 루트
PROJECT_ROOT = Path(__file__).resolve().parents[2]
MEDIA_ROOT = PROJECT_ROOT / "local" / "media"

MAX_UPLOAD_BYTES = 20 * 1024 * 1024
THUMB_SIZE = 600
