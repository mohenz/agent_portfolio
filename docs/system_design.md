# 에이전트 포트폴리오 시스템 설계서

## 0. 문서 정보

| 항목 | 내용 |
|---|---|
| 프로젝트 | 에이전트 포트폴리오 (`D:\workspace\agent_portfolio`, project_key `agent_portfolio`) |
| 버전 | 0.1 초안 (2026년 11월 7일) |
| 상태 | MVP 구현 완료 (2026-11-07). 사용자가 "우선 MVP로 빠르게 만들고 이후 수정"하도록 지시해 11.1의 A1~A3을 승인한 것으로 진행했다. 이후 수정은 사용 결과에 따라 반영한다 |
| 참조 디자인 | `docs/reference/stitch_agent_portfolio_showcase` (화면 6장, 디자인 시스템 2종) |
| 참조 아키텍처 | `D:\workspace\cinetube`, `D:\workspace\secret_album\docs\system_design.md` |
| 적용 표준 | `D:\workspace\project_control\design\bloom_ui_design_standard.md` (일부 예외, 4.3) |
| 운영 형태 | 먼저 이 PC의 `localhost`, 완성 후 cinetube가 운영되는 내부서버로 이전 |

## 1. 목표와 범위

### 1.1 목표

이 PC에서 활동하는 에이전트마다 전신 모습과 생성한 이미지를 올려 두고 볼 수 있는 포트폴리오 사이트를 만든다.

### 1.2 포함 범위 (사용자 요청 기준)

| 번호 | 기능 |
|---|---|
| 1 | 화면 왼쪽: 에이전트의 전신 턴어라운드 GIF를 반복 재생 |
| 2 | 화면 오른쪽: 에이전트의 다양한 사진 표시 |
| 3 | 화면 아래: 이름, 나이, 국적, 직업, 역할, 바디 프로필(키, 가슴, 허리, 엉덩이, 신발 사이즈) |
| 4 | 다양한 사진을 슬라이드 형식으로 보기 |
| 5 | 관리 기능: 사진 추가·삭제, 턴어라운드 GIF 교체 |
| 6 | 관리 기능: 에이전트 등록·수정·삭제 |
| 7 | 라이트·다크 테마 (Bloom 표준) |

### 1.3 제외 범위 (요청 없음, 만들지 않는다)

로그인, 사진 설명(캡션), 사진 순서 변경 화면, 동영상, 사진 여러 장을 돌리는 360° 뷰, 검색, 즐겨찾기, 백그라운드 Worker.

## 2. 전체 구성 (cinetube와 같은 구조)

```text
[브라우저]
   │ 화면 파일                     │ API 호출 + 이미지 요청
   ▼                               ▼
[정적 웹서버 :8100]            [Python 로컬 API :3052]
 python -m http.server          ThreadingHTTPServer
 (화면 파일만)                  scripts/local_api.py → scripts/portfolio_api/
                                     │                 │
                                     ▼                 ▼
                          [PostgreSQL :54329]    [local/media (GIF·사진·썸네일)]
```

| 계층 | 선택 | cinetube와 다른 점 |
|---|---|---|
| 프론트엔드 | Vanilla HTML·CSS·JS, 화면별 HTML + 진입 JS, 빌드 없음 | 없음 |
| 백엔드 | Python 표준 라이브러리 `ThreadingHTTPServer` | 없음 |
| DB | 프로젝트 전용 PostgreSQL, 데이터 폴더 `local/postgres-data` | 포트만 다름 |
| 파일 저장 | `local/media/` | 없음 |
| Worker | 두지 않는다 | cinetube는 `background_jobs` 사용. 이 프로젝트는 사진 처리가 가벼워 업로드 요청 안에서 끝낸다 |
| 이미지 처리 | Pillow로 사진 썸네일(WebP) 생성. GIF는 원본 그대로 저장 | 없음 |
| 실행 | `start-portfolio.cmd`, `stop-portfolio.cmd` | 이름만 다름 |

Docker, Node 빌드 도구는 쓰지 않는다. Python 버전은 서버 이전 시점에 cinetube 서버의 버전을 확인해 맞춘다(미결 항목 B3).

## 3. 포트

기존 등록 포트(3000·3030·3040·3041·3051, 8080·8085·8090·8095, 54323~54328)와 겹치지 않게 제안한다. 현재 이 PC에서 사용 중이지 않음을 확인했다.

| 용도 | 포트 |
|---|---|
| 웹 | `8100` |
| API | `3052` |
| PostgreSQL | `54329` (`127.0.0.1` 바인딩) |

## 4. 화면

### 4.1 화면 목록

| 화면 | 파일 | 설명 |
|---|---|---|
| 포트폴리오 | `index.html` (`?agent=`) | 왼쪽 GIF, 오른쪽 사진, 아래 프로필. 에이전트 전환 |
| 슬라이드 | `pages/slideshow.html` (`?agent=`) | 선택한 에이전트의 사진을 전체 화면 슬라이드로 표시. 이전·다음, 자동 재생·일시정지 |
| 에이전트 관리 | `admin/index.html` | 에이전트 목록, 등록, 삭제 |
| 에이전트 편집 | `admin/agent.html` (`?id=`) | 정보 수정, 턴어라운드 GIF 교체, 사진 추가·삭제 |

메뉴는 포트폴리오 / 슬라이드 / 관리 3개다. 시안의 라이트 화면에는 Lookbook이 있고 다크 화면에는 Slideshow가 있어 서로 달랐다. 둘은 같은 기능이므로 **슬라이드**로 통일한다.

### 4.2 시안에서 가져오는 것과 버리는 것

| 가져온다 | 버린다 (요청 없음) |
|---|---|
| 포트폴리오 배치(왼쪽 큰 영역, 오른쪽 사진, 아래 프로필) | 360° 슬라이더, 포즈 전환 버튼(정면·3/4·옆모습) |
| 슬라이드 화면(진행 바, 카운터, 이전·다음·재생) | 사이드바 관리 화면, 밀도 지수·색 보정·신디케이션 카드 |
| 관리 화면의 사진 카드 + 업로드 영역 | 룩 ID, 컬렉션·시리즈, 에이전시 지점 정보, 푸터 지점 목록 |
| 바디 프로필 표시 영역 | 머리색, 눈색, 소속 계약 표시 |

### 4.3 Bloom 표준 적용과 예외 (사용자 결정: 시안 분위기 + Bloom 표준)

| 항목 | 적용 |
|---|---|
| 글꼴 | Pretendard Variable (표준). 시안의 Syne·Inter·Hanken Grotesk는 쓰지 않는다 |
| 아이콘 | Lucide (표준). Material Symbols는 쓰지 않는다 |
| 문구 | 한국어 (표준). 시안의 영어 라벨은 한국어로 바꾼다 |
| 모서리 | 표준 10px (`0.625rem`). 시안의 직각은 쓰지 않는다 |
| 테마 | 라이트 + 다크, 같은 의미 토큰 (표준) |
| 배치·여백·이미지 중심 구성 | 시안을 따른다. 불필요한 패널·행은 만들지 않고, 인접한 객체는 붙이지 않고 간격을 둔다 |
| Radix UI·shadcn | 이 프로젝트는 빌드 없는 Vanilla 구조라 쓰지 않는다. 대화상자는 네이티브 `<dialog>`를 쓴다. **표준 3.1의 예외이며 secret_album의 결정 D2와 같은 사유다** |

## 5. 데이터 설계

### 5.1 테이블 (3개)

| 테이블 | 용도 | 주요 컬럼 |
|---|---|---|
| `agents` | 에이전트와 페르소나 정보 | `id`, `name`(필수), `age`, `nationality`, `occupation`, `role`, `height_cm`, `bust_cm`, `waist_cm`, `hip_cm`, `shoe_size`, `turnaround_asset_id`, `created_at`, `updated_at` |
| `media_assets` | 업로드한 파일 정보 | `id`(uuid), `object_path`, `thumb_path`, `original_name`, `mime_type`, `size_bytes`, `width`, `height`, `created_at` |
| `agent_photos` | 에이전트와 사진 연결 | `id`, `agent_id`(삭제 시 함께 삭제), `asset_id`, `sort_order`, `created_at` |

- `name` 외 항목은 비워 둘 수 있다. 처음 4명은 이름과 GIF만 등록하기 때문이다.
- 사진 순서는 올린 순서(`sort_order`)이며, 순서를 바꾸는 화면은 만들지 않는다. 필요해지면 컬럼은 이미 있다.
- `shoe_size`는 문자열로 둔다(예: `39 EU`, `245`). 단위를 정해 두지 않는다.

### 5.2 파일 저장 규칙

| 대상 | 경로 |
|---|---|
| 턴어라운드 GIF | `local/media/turnaround/<agent_id>-<uuid>.gif` |
| 사진 원본 | `local/media/photos/<agent_id>/<uuid>.<확장자>` |
| 사진 썸네일 | `local/media/photos/<agent_id>/<uuid>.thumb.webp` |

원본 파일명(한글, `+`, 오타)은 DB의 `original_name`에만 남기고 저장 경로에는 쓰지 않는다. DB 값과 실제 파일 존재 여부를 함께 확인해 보고하는 cinetube 규칙을 따른다.

## 6. API

| 메서드·경로 | 설명 |
|---|---|
| `GET /health` | 상태 확인 |
| `GET /agents` | 에이전트 목록 |
| `GET /agents/{id}` | 정보와 사진 목록 |
| `POST /agents` | 등록 |
| `PATCH /agents/{id}` | 정보 수정 |
| `DELETE /agents/{id}` | 삭제 (연결된 사진·GIF 파일도 함께 삭제) |
| `PUT /agents/{id}/turnaround` | GIF 교체 (이전 파일은 삭제) |
| `POST /agents/{id}/photos` | 사진 추가 (여러 장) |
| `DELETE /photos/{id}` | 사진 삭제 |
| `GET /media/...` | `local/media` 안의 파일만 읽기 전용 제공 |

업로드는 파일 형식(GIF는 `image/gif`, 사진은 JPEG·PNG·WebP)과 크기(1장당 상한, 초안 20MB)를 서버에서 검사한다. 경로에 `..`가 들어간 요청은 거부한다. 계층은 cinetube처럼 `handler`(요청) → `repository`(저장) → `database`로 나누고 `check_module_layers.py`로 검사한다.

## 7. 프로젝트 구조

```text
agent_portfolio/
├─ start-portfolio.cmd / stop-portfolio.cmd
├─ requirements.txt            psycopg[binary], Pillow
├─ README.md
├─ docs/                       system_design.md, reference/
├─ index.html                  포트폴리오
├─ pages/slideshow.html
├─ admin/                      index.html, agent.html
├─ assets/
│  ├─ css/                     tokens.css(Bloom 토큰), base.css, portfolio.css, admin.css
│  ├─ fonts/                   Pretendard Variable
│  ├─ icons/                   Lucide SVG
│  └─ js/
│     ├─ api-config.js         API 주소 결정 (localhost / 서버 hostname)
│     ├─ pages/                화면별 진입 JS
│     └─ shared/               store.js, ui.js, theme.js
├─ scripts/
│  ├─ local_api.py, portfolio_api/, check_module_layers.py
│  ├─ start_local_db.ps1, stop_local_db.ps1, launch_portfolio.ps1
│  └─ seed_agents.py           처음 4명(이름 + GIF) 등록
├─ local/                      schema.sql, postgres-data/, media/ (Git 제외)
└─ tests/
```

## 8. 처음 데이터

`design` 폴더의 GIF 4개로 에이전트 4명을 이름과 GIF만 등록한다(`seed_agents.py`). 나머지 항목은 관리 화면에서 직접 입력한다. 원본 GIF는 `design`에 그대로 두고 `local/media/turnaround/`로 복사한다.

| GIF | 크기 | 비고 |
|---|---|---|
| 에이전트 4명분 | 400×600 ~ 512×1024, 4프레임, 약 230~720KB | 비율이 서로 달라 왼쪽 영역은 비율을 유지해 맞춘다(잘라내지 않는다) |

## 9. 서버 이전 계획

| 단계 | 내용 |
|---|---|
| 1 | 이 PC에서 완성하고 검증 |
| 2 | 서버의 포트·Python 버전·PostgreSQL 설치 상태 확인 |
| 3 | 서버 폴더에 소스 배치, DB 스키마 적용, `local/media` 복사 (cinetube의 Gitea push 배포 방식을 따를지 결정) |
| 4 | **관리 화면 보호 방식 결정** — 지금은 로그인이 없어 같은 네트워크의 누구나 삭제할 수 있다. 이전 전에 반드시 정한다 |
| 5 | 프로세스 유지(Supervisor), 백업 스크립트 |

`api-config.js`는 cinetube처럼 접속한 hostname의 API 포트를 자동으로 쓰도록 만들어, 이전 시 주소를 고치지 않게 한다.

## 10. 검증 계획

| 대상 | 방법 |
|---|---|
| API | `unittest` (등록·수정·삭제, 업로드 검증, 경로 침입 거부) |
| 계층 | `check_module_layers.py` |
| 화면 | 브라우저에서 포트폴리오·슬라이드·관리 화면 확인(라이트·다크, 비율이 다른 GIF 4개, 폭이 좁은 화면) |
| 정적 검사 | `node --check`, `python -m py_compile` |

## 11. 결정 요청과 미결 사항

### 11.1 승인 요청

| 번호 | 내용 |
|---|---|
| A1 | 3개 테이블(5.1)로 `agent_portfolio` 전용 PostgreSQL을 만들어도 되는가 |
| A2 | 포트 `8100`, `3052`, `54329` 사용 |
| A3 | 프로젝트 레지스트리(`project_registry.md`)에 `agent_portfolio` 등록, 상태 파일 생성 |

### 11.2 구축 전에 정하면 좋은 것

| 번호 | 내용 | 임시 기준 |
|---|---|---|
| B1 | 사진 1장당 업로드 상한 | 20MB |
| B2 | 에이전트 삭제 시 사진 파일까지 지울지 | 확인창을 거쳐 함께 삭제 |
| B3 | 서버의 Python·PostgreSQL 버전 | 이전 시점에 서버에서 확인 |
