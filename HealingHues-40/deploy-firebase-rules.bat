@echo off
echo Deploying Firebase Security Rules...
echo.

echo Step 1: Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

echo.
echo Step 2: Deploying Firestore Rules...
firebase deploy --only firestore:rules

echo.
echo Deployment complete! Check the output above for any errors.
echo.
pause 