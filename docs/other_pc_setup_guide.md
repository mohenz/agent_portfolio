# 다른 PC 개발 환경 연결 가이드

## 1. 목적과 현재 기준

다른 Windows PC에서 `agent_portfolio`를 내려받아 개발을 이어가기 위한 절차다. 코드는 Git으로, 데이터(DB와 사진·GIF)는 따로 옮긴다.

| 항목 | 값 |
|---|---|
| 저장소 | `https://github.com/mohenz/agent_portfolio.git` (공개, 브랜치 `main`) |
| 개발 기준 경로 | `D:\workspace\agent_portfolio` |
| Python | 3.10 이상 (이 PC는 3.10.11). 프로젝트 전용 가상환경은 쓰지 않고 `python`을 그대로 쓴다 |
| 필요한 패키지 | `psycopg[binary]==3.3.4`, `Pillow` (`requirements.txt`) |
| PostgreSQL | 16 이상. 이 PC는 18. 설치 경로 `C:\Program Files\PostgreSQL\<버전>` |
| 웹 | `http://localhost:8100` |
| API | `http://127.0.0.1:3052` |
| DB | `127.0.0.1:54329`, DB 이름 `agent_portfolio`, 사용자 `postgres`, 인증 `trust`(비밀번호 없음) |

**Git에 포함되지 않는 것**: `local/postgres-data`(DB 파일), `local/media`(GIF·사진), `local/backups`, `local/*.log`. 새 PC에서 같은 에이전트와 사진을 보려면 4장의 방법으로 옮겨야 한다.

## 2. 사전 설치

1. Git for Windows
2. Python 3.10 이상 (설치할 때 "Add python.exe to PATH"를 선택)
3. PostgreSQL 16 이상 (기본 설치 경로, 포트는 기본값 5432를 써도 된다. 이 프로젝트는 별도 포트 54329로 따로 띄운다)

확인:

```powershell
git --version
python --version
Get-ChildItem 'C:\Program Files\PostgreSQL' -Directory
```

`scripts\start_local_db.ps1`은 설치된 PostgreSQL 중 **가장 높은 버전**을 자동으로 고른다. 이미 만들어진 데이터 폴더가 있으면 그 폴더의 버전(`PG_VERSION`)과 같은 설치본을 쓴다. 따라서 PostgreSQL 경로를 고칠 필요는 없다.

## 3. 새 PC에서 처음 실행

```powershell
cd D:\workspace
git clone https://github.com/mohenz/agent_portfolio.git
cd agent_portfolio
python -m pip install --user -r requirements.txt
.\start-portfolio.cmd
```

`start-portfolio.cmd`가 하는 일(`scripts\start_local_db.ps1`, `scripts\launch_portfolio.ps1`):

| 순서 | 동작 |
|---|---|
| 1 | `python`에서 `psycopg`, `PIL`을 불러올 수 있는지 확인(없으면 설치 명령을 안내하고 중단) |
| 2 | `local\postgres-data`가 없으면 `initdb`로 새 DB 클러스터 생성(`--auth=trust`, UTF8) |
| 3 | 포트 54329에서 PostgreSQL 기동 |
| 4 | `agent_portfolio` DB가 없으면 생성 |
| 5 | `local\schema.sql` 적용 (`create ... if not exists`만 쓰므로 여러 번 실행해도 기존 데이터를 지우지 않는다) |
| 6 | API(3052)와 웹 서버(8100)를 기동하고 브라우저를 연다 |

처음에는 에이전트가 없는 빈 상태다. 이제 데이터를 채우는 방법을 고른다.

## 4. 데이터 채우기

### 4.1 방법 A: 새로 시작 (GIF만 있으면 됨)

GIF가 들어 있는 폴더를 지정해 에이전트를 이름과 GIF만 등록한다. 파일명에서 첫 `_` 앞부분이 이름이 된다(예: `이름_turnaround.gif`). 이미 있는 이름은 건너뛴다.

```powershell
python scripts\seed_agents.py D:\workspace\design
```

나이, 국적 같은 나머지 정보와 사진은 관리 화면(`http://localhost:8100/admin/index.html`)에서 입력한다.

### 4.2 방법 B: 기존 PC의 데이터를 그대로 옮기기

DB에는 파일 경로가 `local/media` 기준 상대 경로(`turnaround/1-….gif`, `photos/1/….jpg`)로 저장되어 있다. 따라서 **DB 덤프와 `local\media` 폴더를 함께** 옮기면 경로가 그대로 맞는다. 둘 중 하나만 옮기면 화면에 이미지가 깨진다.

#### (1) 기존 PC에서 내보내기

서비스(`start-portfolio.cmd`)가 켜져 있는 상태에서 실행한다. `<버전>`은 기존 PC의 PostgreSQL 버전(예: 18)이다.

```powershell
cd D:\workspace\agent_portfolio
New-Item -ItemType Directory -Force local\backups | Out-Null
$pg = 'C:\Program Files\PostgreSQL\<버전>\bin'
& "$pg\pg_dump.exe" -h 127.0.0.1 -p 54329 -U postgres -d agent_portfolio --data-only -Fc -f local\backups\agent_portfolio.dump
Compress-Archive -Path local\media -DestinationPath local\backups\media.zip -Force
```

`local\backups\agent_portfolio.dump`와 `local\backups\media.zip` 두 파일을 USB나 공유 폴더로 새 PC에 복사한다. 이 파일들에는 에이전트 사진이 들어 있으므로 공개 저장소나 클라우드 공개 링크에 올리지 않는다.

#### (2) 새 PC에서 가져오기

3장을 먼저 끝내 **빈 DB와 테이블이 만들어진 상태**여야 한다. 두 파일을 새 PC의 `D:\workspace\agent_portfolio\local\backups\`에 둔 뒤 실행한다.

```powershell
cd D:\workspace\agent_portfolio
$pg = 'C:\Program Files\PostgreSQL\<새 PC 버전>\bin'

# 1) 사진·GIF 파일 복원 (local\media 폴더가 생긴다)
Expand-Archive -Path local\backups\media.zip -DestinationPath local -Force

# 2) DB 데이터 복원 (테이블은 이미 있으므로 데이터만 넣는다)
& "$pg\pg_restore.exe" -h 127.0.0.1 -p 54329 -U postgres -d agent_portfolio --data-only --exit-on-error local\backups\agent_portfolio.dump
```

주의:

- **새 PC의 DB가 비어 있어야 한다.** 4.1의 `seed_agents.py`를 이미 실행했다면 에이전트가 중복되거나 번호가 충돌한다. 그 경우 `stop-portfolio.cmd`로 끈 뒤 `local\postgres-data` 폴더를 지우고 3장부터 다시 한다(새 PC의 로컬 DB이므로 지워도 되는지 확인한 뒤).
- 덤프의 PostgreSQL 버전은 같거나 **더 낮은 버전**의 서버에만 복원된다. 새 PC가 더 높은 버전이면 문제없고, 더 낮으면 복원이 실패할 수 있다.
- 복원 후 에이전트 번호 순번(`agents_id_seq` 등)도 함께 복원되어 새로 등록해도 번호가 겹치지 않는다.

#### (3) 확인

```powershell
& "$pg\psql.exe" -h 127.0.0.1 -p 54329 -U postgres -d agent_portfolio -tAc "select (select count(*) from agents) as agents, (select count(*) from media_assets) as assets, (select count(*) from agent_photos) as photos"
```

기존 PC에서 같은 명령을 실행한 값과 같아야 한다. 이어서 `http://localhost:8100`에서 GIF와 사진이 보이는지 확인한다.

이 가이드의 내보내기·가져오기 명령은 이 PC에서 새 DB를 하나 만들어 그대로 복원해 보고, 에이전트·파일·사진 개수와 번호 순번이 원본과 같은 것을 확인했다(2026-11-09). 사진·GIF 파일 복사(`media.zip`)는 확인하지 않았다.

## 5. 일상 작업

| 작업 | 명령 |
|---|---|
| 시작 | `start-portfolio.cmd` |
| 종료 | `stop-portfolio.cmd` (웹 8100, API 3052, DB를 모두 끈다) |
| API 점검 | `python tests\test_api_smoke.py` (서비스가 켜져 있어야 한다. 임시 에이전트를 만들고 지운다) |
| 코드 받기 | `git pull` |
| 코드 올리기 | `git add -A` → `git commit` → `git push` |

## 6. 두 PC를 함께 쓸 때의 주의

- **DB와 사진은 PC마다 따로다.** Git은 코드만 동기화한다. 한 PC에서 에이전트나 사진을 바꿔도 다른 PC에는 반영되지 않는다.
- 데이터를 두 PC에서 모두 고치면 합칠 방법이 없다(자동 병합 없음). 데이터를 수정하는 PC를 하나로 정하고, 다른 PC에는 4.2의 방법으로 필요할 때 복사해 쓰는 것을 권한다.
- 코드만 다른 PC에서 고칠 때는 3장과 4.1(GIF 몇 개만 있으면 됨)이면 충분하다.

## 7. 문제 해결

| 증상 | 원인과 조치 |
|---|---|
| `Python packages are required` | `python -m pip install --user -r requirements.txt` 실행 |
| `PostgreSQL was not found` | PostgreSQL을 `C:\Program Files\PostgreSQL\<버전>`에 설치. 다른 경로에 설치했다면 `scripts\start_local_db.ps1`, `scripts\stop_local_db.ps1`의 경로를 수정 |
| `PostgreSQL start failed` | `local\postgres.log` 확인. 포트 54329를 다른 프로그램이 쓰는지 확인(`Get-NetTCPConnection -LocalPort 54329`) |
| 화면에 "서버에 연결할 수 없습니다" | API가 꺼져 있다. `start-portfolio.cmd` 실행. `local\api.err.log` 확인 |
| 이미지가 깨져 보임 | DB는 옮겼지만 `local\media`를 옮기지 않았거나, 반대의 경우. 4.2를 둘 다 수행 |
| 복원 중 `duplicate key` 오류 | 새 PC에 이미 데이터가 있다. 4.2(2)의 주의 항목 참고 |
| 포트 8100, 3052가 이미 사용 중 | 다른 프로세스를 끄거나, `stop-portfolio.cmd`로 이전 실행을 종료 |

## 8. 서버 이전 시 참고

내부서버(cinetube가 운영되는 서버)로 옮길 때도 4.2의 덤프·복원 방식을 그대로 쓴다. 서버에서 추가로 정할 것은 다음과 같다. 자세한 내용은 `system_design.md` 9장을 따른다.

- 서버의 Python·PostgreSQL 버전과 포트 충돌 여부
- 배포 방식(Git 가져오기 또는 Gitea push 등)
- **관리 화면 접근 보호.** 현재는 로그인이 없어 같은 네트워크의 누구나 삭제할 수 있다. 서버에 올리기 전에 반드시 정한다.
- API와 웹이 현재 `127.0.0.1`에만 바인딩되어 있어, 다른 PC에서 접속하려면 바인딩 주소를 바꿔야 한다(프런트는 접속한 주소의 3052 포트를 API로 자동 사용).
