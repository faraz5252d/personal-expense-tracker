@echo off
title Personal Expense Management System
echo ========================================================
echo   Launching Personal Expense Management System
echo ========================================================

cd /d "%~dp0backend"
start "Expense Tracker - Backend (Spring Boot)" cmd /k "mvn spring-boot:run"

timeout /t 5 /nobreak >nul

cd /d "%~dp0frontend"
start "Expense Tracker - Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

start http://localhost:5173
echo.
echo Application launched successfully at http://localhost:5173 !
pause
