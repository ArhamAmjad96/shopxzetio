@echo off
title Push ShopXzetio to GitHub
color 0b
echo ========================================================
echo        SHOPXZETIO GITHUB DEPLOYMENT WIZARD
echo ========================================================
echo.
set "PATH=%PATH%;C:\Users\arham\AppData\Local\MinGit\cmd"

echo Step 1: Please generate a token from:
echo https://github.com/settings/tokens/new?scopes=repo^&description=ShopXzetio
echo.
set /p GITHUB_TOKEN="Paste your GitHub Token (starts with ghp_): "

if "%GITHUB_TOKEN%"=="" (
    echo [ERROR] Token cannot be empty.
    pause
    exit /b
)

echo.
echo [1/3] Setting remote with authentication...
"C:\Users\arham\AppData\Local\MinGit\cmd\git.exe" remote set-url origin https://%GITHUB_TOKEN%@github.com/maaz9999/shopxzetio.git

echo [2/3] Staging and verifying all files...
"C:\Users\arham\AppData\Local\MinGit\cmd\git.exe" add -A
"C:\Users\arham\AppData\Local\MinGit\cmd\git.exe" commit -m "feat: complete esports ecommerce platform with daraz layout, multi-page routing, WebGL background, and pro features"

echo [3/3] Pushing to https://github.com/maaz9999/shopxzetio...
"C:\Users\arham\AppData\Local\MinGit\cmd\git.exe" push -u origin main --force

echo.
echo ========================================================
echo   SUCCESS! All files are now live on your GitHub repo!
echo ========================================================
echo.
pause
