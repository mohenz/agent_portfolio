"""에이전트 포트폴리오 API 진입점. 실제 구현은 `scripts/portfolio_api/` 패키지에 있다.

실행: python scripts/local_api.py
"""

import os
import sys

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)

from portfolio_api.handler import Handler, create_server, serve_forever  # noqa: E402

__all__ = ["Handler", "create_server", "serve_forever"]

if __name__ == "__main__":
    serve_forever()
