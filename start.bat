@echo off
REM Kemcrypt Password Generator - Windows Quick Start Script
REM Double-click this file to start the development server

title Kemcrypt Dev Server

echo.
echo ============================================================
echo    Kemcrypt Password Generator - Development Server
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo Starting development server...
echo.

REM Start the Python server
python dev-server.py

REM If server stops, pause to show error messages
pause
