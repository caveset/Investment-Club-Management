@echo off
REM Investment Club Management App - Supabase Deployment Script (Windows)
REM This script deploys your backend to Supabase Edge Functions

setlocal enabledelayedexpansion

echo ========================================================
echo 🚀 Investment Club App - Supabase Deployment
echo ========================================================
echo.

set PROJECT_REF=heozvgsotrvfaucnkbvh
set FUNCTION_NAME=make-server-f4ff8ddc

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI is not installed
    echo.
    echo Please install it first:
    echo.
    echo   Using Scoop:
    echo     scoop install supabase
    echo.
    echo   Or using npm:
    echo     npm install -g supabase
    echo.
    pause
    exit /b 1
)

echo ✅ Supabase CLI is installed
echo.

REM Check if already linked to project
if not exist ".supabase\config.toml" (
    echo 🔗 Linking to Supabase project...
    echo.
    echo Please enter your database password when prompted.
    echo You can find/reset it at:
    echo https://supabase.com/dashboard/project/%PROJECT_REF%/settings/database
    echo.
    
    supabase link --project-ref %PROJECT_REF%
    
    if !ERRORLEVEL! EQU 0 (
        echo ✅ Successfully linked to project
        echo.
    ) else (
        echo ❌ Failed to link to project
        pause
        exit /b 1
    )
) else (
    echo ✅ Already linked to Supabase project
    echo.
)

REM Deploy the function
echo 📦 Deploying backend function...
echo.
echo Function: %FUNCTION_NAME%
echo Endpoint: https://%PROJECT_REF%.supabase.co/functions/v1/%FUNCTION_NAME%
echo.

supabase functions deploy %FUNCTION_NAME%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo ========================================================
    echo 🎉 Your backend is now live!
    echo ========================================================
    echo.
    echo 📍 API Endpoint:
    echo    https://%PROJECT_REF%.supabase.co/functions/v1/%FUNCTION_NAME%
    echo.
    echo 🔍 Health Check:
    echo    https://%PROJECT_REF%.supabase.co/functions/v1/%FUNCTION_NAME%/health
    echo.
    echo 📊 View Logs:
    echo    supabase functions logs %FUNCTION_NAME%
    echo.
    echo 🌐 Dashboard:
    echo    https://supabase.com/dashboard/project/%PROJECT_REF%/functions/%FUNCTION_NAME%/logs
    echo.
    echo ========================================================
    echo.
    echo Next Steps:
    echo.
    echo 1. Refresh your app in the browser
    echo 2. Look for the green '✅ PRODUCTION MODE' message
    echo 3. Click 'Initialize Demo Data' to create users
    echo 4. Log in as admin:
    echo    Email: admin@club.com
    echo    Password: InvestClub2026!
    echo.
    echo Happy investing! 💰
    echo.
) else (
    echo.
    echo ❌ Deployment failed
    echo.
    echo Troubleshooting:
    echo 1. Check if you're logged in: supabase login
    echo 2. Check logs: supabase functions logs %FUNCTION_NAME%
    echo 3. Try redeploying: supabase functions deploy %FUNCTION_NAME%
    echo.
    pause
    exit /b 1
)

pause
