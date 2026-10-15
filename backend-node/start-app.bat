@echo off
title Personal Expense Management System
echo ========================================================
echo   Launching Personal Expense Management System
echo ========================================================

cd /d "C:\Users\mohammad faraz\Desktop\personal-expense-tracker\backend"
start "Expense Tracker - Backend" cmd /k "npm start"

timeout /t 2 /nobreak >nul

cd /d "C:\Users\mohammad faraz\Desktop\personal-expense-tracker\frontend"
start "Expense Tracker - Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

start http://localhost:5173
echo.
echo Application launched successfully at http://localhost:5173 !
pause
