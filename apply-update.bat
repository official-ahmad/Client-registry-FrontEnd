@echo off
echo ================================================
echo   Applying Enhanced Features Update
echo ================================================
echo.

echo Step 1: Backing up old Dashboard...
cd src
if exist Dashboard.jsx.bak (
    del Dashboard.jsx.bak
)
copy Dashboard.jsx Dashboard.jsx.bak

echo Step 2: Replacing Dashboard with new version...
del Dashboard.jsx
ren DashboardNew.jsx Dashboard.jsx

echo.
echo ================================================
echo   Update Complete!
echo ================================================
echo.
echo New Features:
echo [+] Dark/Light Mode Toggle
echo [+] Mobile Responsive Design
echo [+] WhatsApp Messaging
echo [+] Receipt Printing
echo.
echo Backup saved as: Dashboard.jsx.bak
echo.
echo Please restart the development server:
echo   npm run dev
echo.
pause
