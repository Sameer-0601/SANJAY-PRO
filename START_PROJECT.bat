@echo off
echo ===================================================
echo     STARTING NEXUS INVOICE GENERATOR MERN STACK
echo ===================================================
echo.

echo [1/5] Killing previous Node.js processes to prevent EADDRINUSE...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [2/5] Starting local MongoDB instance (Requires MongoDB installed)...
start "MongoDB Setup" cmd /c "mongod --dbpath %USERPROFILE%\mongodb-data"
timeout /t 3 /nobreak >nul

echo.
echo [3/5] Starting Notification Service Prep (n8n Ready)...
echo (Currently configured for Phase 2 automation scale)

echo.
echo [4/5] Starting Backend Server (Express)...
start "Backend API" cmd /c "cd server && npm install && node index.js"
timeout /t 5 /nobreak >nul

echo.
echo [5/5] Starting Frontend Client (Vite + React)...
start "Frontend UI" cmd /c "cd client && npm install && npm run dev"

echo.
echo ===================================================
echo       SYSTEM IS BOOTSTRAPPING. PLEASE WAIT...
echo ===================================================
echo.
echo Backend API will be available at: http://localhost:5001
echo Frontend UI will be available at: http://localhost:5173
echo.
echo Done! You can close this window.
pause
