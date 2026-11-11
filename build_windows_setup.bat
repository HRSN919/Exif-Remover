@echo off
chcp 65001 > nul
echo ========================================================
echo   ByHRSN Exif Cleaner v2.5 - Windows Installer Builder
echo   Official software by byhrsn.com
echo ========================================================
echo.
echo [1/3] Checking Node.js and dependencies...
if not exist node_modules (
    echo Installing project dependencies...
    call npm install
)

echo.
echo [2/3] Building React application with Vite...
call npm run build

echo.
echo [3/3] Packaging Windows setup (.exe) with Electron Builder...
call npx electron-builder --win nsis portable

echo.
echo ========================================================
echo   Build Completed Successfully!
echo   Installer file is in: dist_electron/
echo   ByHRSN Exif Cleaner Setup 2.5.0.exe
echo ========================================================
pause
