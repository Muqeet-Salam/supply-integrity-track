@echo off
cd /d "%~dp0"
echo Current directory: %cd%
echo.
echo ========================================
echo 🔄 Supply Chain QR + Blockchain Tools  
echo ========================================
echo.
echo 📖 WORKFLOW OPERATIONS:
echo 1. 🔄 Complete Workflow Guide
echo 2. 📦 Create Batch (with product name + auto QR)
echo 3. 🏪 Mark Ready for Sale
echo 4. 🔍 View History
echo.
echo 🔗 BLOCKCHAIN SETUP:
echo 5. 🚀 Start Hardhat Node
echo 6. 📄 Deploy Contracts  
echo 7. 👥 Setup Roles
echo.
echo 📱 QR OPERATIONS:
echo 8. 📱 List Available QR Codes
echo 9. 🔍 Scan QR Code
echo 10. 🔄 Update QR with Live Data
echo 11. 📊 View QR History
echo.
echo 0. Exit
echo.
set /p choice=Enter your choice (0-11): 

if "%choice%"=="1" (
    echo 📖 Showing complete workflow guide...
    echo.
    npm run workflow-help
)
if "%choice%"=="2" (
    set /p productname=📦 Enter product name: 
    if "%productname%"=="" (
        echo ❌ Product name cannot be empty!
        goto end
    )
    echo.
    echo 🏭 Creating batch for: %productname%
    npm run create-batch "%productname%"
)
if "%choice%"=="3" (
    set /p batchid=🏪 Enter batch ID (or press Enter for most recent): 
    if "%batchid%"=="" (
        echo Marking most recent batch ready for sale...
        npm run mark-ready
    ) else (
        echo Marking batch %batchid% ready for sale...
        npm run mark-ready %batchid%
    )
)
if "%choice%"=="4" (
    set /p batchid=📊 Enter batch ID (or press Enter for most recent): 
    if "%batchid%"=="" (
        echo Viewing history for most recent batch...
        npm run view-history
    ) else (
        echo Viewing history for batch %batchid%...
        npm run view-history %batchid%
    )
)
if "%choice%"=="5" (
    echo 🚀 Starting Hardhat node...
    echo 💡 Keep this running in background for blockchain operations
    npx hardhat node
)
if "%choice%"=="6" (
    echo 📄 Deploying contracts...
    npm run deploy
)
if "%choice%"=="7" (
    echo 👥 Setting up roles...
    npm run setup-roles
)
if "%choice%"=="8" (
    echo 📱 Available QR Codes:
    npm run workflow-help list-qr
)
if "%choice%"=="9" (
    echo.
    echo 📱 Available QR files:
    dir qr-codes\*_qr_data.json /b 2>nul
    echo.
    set /p qrfile=🔍 Enter QR filename (e.g., batch_0_live_qr_data.json): 
    if "%qrfile%"=="" (
        echo ❌ No file specified!
        goto end
    )
    echo Scanning QR: %qrfile%
    npm run scan-qr qr-codes\%qrfile%
)
if "%choice%"=="10" (
    set /p batchid=🔄 Enter batch ID: 
    if "%batchid%"=="" (
        echo ❌ Batch ID required!
        goto end
    )
    echo Updating QR with live data for batch %batchid%...
    npm run update-qr-live %batchid%
)
if "%choice%"=="11" (
    set /p batchid=📊 Enter batch ID: 
    if "%batchid%"=="" (
        echo ❌ Batch ID required!
        goto end
    )
    echo Viewing QR history for batch %batchid%...
    npm run batch-qr-history %batchid%
)
if "%choice%"=="0" (
    echo 👋 Goodbye!
    exit
)

:end
echo.
echo ✅ Operation completed. Press any key to continue...
pause >nul
goto :eof