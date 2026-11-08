$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DataDir = Join-Path $ProjectRoot "local\postgres-data"

# 웹 서버(8100)와 API(3052)는 이 프로젝트의 포트를 점유한 프로세스만 종료한다.
foreach ($Port in 8100, 3052) {
  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

if (Test-Path $DataDir) {
  $PgVersion = (Get-Content -Raw (Join-Path $DataDir "PG_VERSION")).Trim()
  $PgBin = "C:\Program Files\PostgreSQL\$PgVersion\bin"
  & (Join-Path $PgBin "pg_ctl.exe") -D $DataDir -m fast stop
}

Write-Host "Agent Portfolio stopped."
