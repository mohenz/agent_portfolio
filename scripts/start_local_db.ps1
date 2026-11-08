$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DataDir = Join-Path $ProjectRoot "local\postgres-data"
$LogPath = Join-Path $ProjectRoot "local\postgres.log"
$SchemaPath = Join-Path $ProjectRoot "local\schema.sql"
$ApiScript = Join-Path $ProjectRoot "scripts\local_api.py"
$ApiOutLog = Join-Path $ProjectRoot "local\api.out.log"
$ApiErrLog = Join-Path $ProjectRoot "local\api.err.log"
$DbPort = "54329"
$DbName = "agent_portfolio"
$ApiPort = "3052"

$PgInstallations = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue |
  Sort-Object { [int]$_.Name } -Descending
$ExistingPgVersionPath = Join-Path $DataDir "PG_VERSION"
$ExistingPgVersion = if (Test-Path $ExistingPgVersionPath) { (Get-Content -Raw $ExistingPgVersionPath).Trim() } else { "" }
$PgRoot = if ($ExistingPgVersion) {
  $PgInstallations | Where-Object { $_.Name -eq $ExistingPgVersion } | Select-Object -First 1 -ExpandProperty FullName
} else {
  $PgInstallations | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $PgRoot) { throw "PostgreSQL was not found under C:\Program Files\PostgreSQL" }
$PgBin = Join-Path $PgRoot "bin"

python -c "import psycopg, PIL" 2>$null
if ($LASTEXITCODE -ne 0) {
  throw "Python packages are required. Run: python -m pip install --user -r requirements.txt"
}

New-Item -ItemType Directory -Force (Join-Path $ProjectRoot "local") | Out-Null

if (-not (Test-Path $DataDir)) {
  & (Join-Path $PgBin "initdb.exe") -D $DataDir -U postgres --auth=trust --encoding=UTF8 --locale=C
  if ($LASTEXITCODE -ne 0) { throw "initdb failed" }
}

& (Join-Path $PgBin "pg_isready.exe") -h 127.0.0.1 -p $DbPort 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  $proc = Start-Process (Join-Path $PgBin "pg_ctl.exe") -WindowStyle Hidden -PassThru `
    -ArgumentList @('start', '-D', "`"$DataDir`"", '-l', "`"$LogPath`"", '-o', "`"-p $DbPort`"", '-w', '-t', '30')
  $proc.WaitForExit()
  if ($proc.ExitCode -ne 0) { throw "PostgreSQL start failed. Check $LogPath" }
}

$env:PGHOST = "127.0.0.1"
$env:PGPORT = $DbPort
$env:PGUSER = "postgres"
$env:PGDATABASE = "postgres"

$dbExists = & (Join-Path $PgBin "psql.exe") -tAc "select 1 from pg_database where datname='$DbName';"
if ($LASTEXITCODE -ne 0) { throw "PostgreSQL connection check failed." }
if (-not ($dbExists -match "1")) {
  & (Join-Path $PgBin "createdb.exe") $DbName
  if ($LASTEXITCODE -ne 0) { throw "Database creation failed." }
}

# schema.sql은 create ... if not exists 만 사용하므로 매번 적용해도 데이터가 지워지지 않는다.
& (Join-Path $PgBin "psql.exe") -d $DbName -v ON_ERROR_STOP=1 -q -f $SchemaPath
if ($LASTEXITCODE -ne 0) { throw "Schema apply failed." }

$runningApi = Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*local_api.py*" -and $_.CommandLine -like "*$ProjectRoot*" }
if (-not $runningApi) {
  $env:PGDATABASE = $DbName
  $env:PORTFOLIO_API_PORT = $ApiPort
  Start-Process -FilePath "python" -ArgumentList @("`"$ApiScript`"") -WorkingDirectory $ProjectRoot -WindowStyle Hidden `
    -RedirectStandardOutput $ApiOutLog -RedirectStandardError $ApiErrLog
}

Write-Host "Agent Portfolio DB is running."
Write-Host "API: http://127.0.0.1:$ApiPort"
Write-Host "PostgreSQL: 127.0.0.1:$DbPort / db=$DbName / user=postgres / auth=trust"
