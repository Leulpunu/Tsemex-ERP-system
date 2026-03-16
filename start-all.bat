@echo off
echo ========================================
echo Tsemex ERP System - Starting All Services
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Starting Backend Server (Port 5000)...
start "Tsemex-Backend" cmd /k "cd /d %~dp0backend && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Dev Server (Port 5173)...
start "Tsemex-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo.
echo Backend API:   http://localhost:5000
echo Frontend App:  http://localhost:5173
echo.
echo Press any key to close this window...
echo ========================================
pause >nul
