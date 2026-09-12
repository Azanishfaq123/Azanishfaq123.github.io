@echo off
cd /d "%~dp0"
echo.
echo  Starting portfolio on http://localhost:3000
echo  Close this window to stop the server.
echo.
where node >nul 2>nul
if %errorlevel%==0 (
  npx --yes serve . -p 3000
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1" -Port 3000
)
pause
