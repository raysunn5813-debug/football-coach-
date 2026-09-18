@echo off
cd /d "%~dp0"
title Chalkboard Football Coach Server
echo Starting Chalkboard Football Coach Server...
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
call .venv\Scripts\activate.bat
python backend\run.py
pause
