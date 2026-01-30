@echo off
REM A+ Scanner Local Server Launcher
REM This starts a simple web server so scanners can access Polygon.io API

echo ========================================
echo  A+ Scanner Local Server
echo  ChartScript AI LLC
echo ========================================
echo.
echo Starting web server on http://localhost:8000
echo.
echo Open your browser and go to:
echo   http://localhost:8000/aplus-polygon-scanner.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
