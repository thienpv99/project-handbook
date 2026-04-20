@echo off
echo Attempting to start Python http.server...
python -m http.server 8080
if %errorlevel% neq 0 (
    echo.
    echo Python failed or is not installed. Trying npx http-server...
    npx http-server -p 8080
)
pause
