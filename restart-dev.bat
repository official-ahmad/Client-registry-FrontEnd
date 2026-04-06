@echo off
cls
echo ================================================
echo   Restarting Development Server
echo ================================================
echo.
echo This will fix the ThemeProvider error
echo.
echo Step 1: Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Starting fresh server...
echo.
npm run dev
