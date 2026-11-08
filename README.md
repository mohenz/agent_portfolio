# 에이전트 포트폴리오

이 PC에서 활동하는 에이전트의 전신 턴어라운드 GIF, 사진, 페르소나 정보를 보여주는 사이트. 설계는 `docs/system_design.md`.

## 실행

```text
python -m pip install --user -r requirements.txt   # 처음 한 번
start-portfolio.cmd                                  # DB, API, 웹 서버를 켜고 브라우저를 연다
stop-portfolio.cmd                                   # 모두 끈다
python scripts\seed_agents.py                        # design 폴더의 GIF로 에이전트 등록(이미 있으면 건너뜀)
```

| 용도 | 주소 |
|---|---|
| 웹 | http://localhost:8100 |
| API | http://127.0.0.1:3052 |
| PostgreSQL | 127.0.0.1:54329 (db `agent_portfolio`) |

## 화면

| 화면 | 주소 |
|---|---|
| 포트폴리오 | `/index.html?agent=<id>` |
| 슬라이드 | `/pages/slideshow.html?agent=<id>` |
| 에이전트 관리 | `/admin/index.html` |
| 에이전트 편집 | `/admin/agent.html?id=<id>` |

## 검증

```text
python tests\test_api_smoke.py     # API가 떠 있어야 한다. 임시 에이전트를 만들고 지운다.
```

## 주의

관리 화면에는 로그인이 없다. localhost 전용으로만 쓰고, 서버로 옮기기 전에 접근 보호를 정한다.
