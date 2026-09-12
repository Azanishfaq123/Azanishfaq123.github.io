@echo off
cd /d "%~dp0"
echo.
echo  Starting Abdul Azan portfolio...
echo  Browser: http://localhost:5088
echo.
dotnet run --project "AbdulAzan.Portfolio\AbdulAzan.Portfolio.csproj" --launch-profile AbdulAzan.Portfolio
pause
