@echo off
cd /d "%~dp0"
echo Current directory: %cd%
echo.
echo =====================================
echo Supply Chain QR + Blockchain Tools  
echo =====================================
echo.
echo Choose an action:
echo 1. Start Hardhat Node
echo 2. Deploy Contracts
echo 3. Create Batch
echo 4. Mark Ready for Sale
echo 5. View History
echo 6. Generate QR Code (Basic)
echo 7. Update QR with Live Data
echo 8. Scan QR Code
echo 9. View QR History
echo 10. Exit
echo.
set /p choice=Enter your choice (1-10): 

if "%choice%"=="1" (
    echo Starting Hardhat node...
    npx hardhat node
)
if "%choice%"=="2" (
    echo Deploying contracts...
    npx hardhat run scripts/deploy.js --network localhost
)
if "%choice%"=="3" (
    echo Creating new batch...
    npx hardhat run scripts/createBatch.js --network localhost
)
if "%choice%"=="4" (
    echo Marking batch ready for sale...
    npx hardhat run scripts/markReadyForSale.js --network localhost
)
if "%choice%"=="5" (
    echo Viewing batch history...
    npx hardhat run scripts/viewHistory.js --network localhost
)
if "%choice%"=="6" (
    set /p batchid=Enter batch ID: 
    echo Generating basic QR code for batch %batchid%...
    node utils/generateQR.js %batchid%
)
if "%choice%"=="7" (
    set /p batchid=Enter batch ID: 
    echo Updating QR with live blockchain data for batch %batchid%...
    npx hardhat run scripts/updateQRLive.js --network localhost -- %batchid%
)
if "%choice%"=="8" (
    echo Scanning QR code...
    node utils/scanQR.js
)
if "%choice%"=="9" (
    set /p batchid=Enter batch ID: 
    echo Viewing QR history for batch %batchid%...
    node utils/batchQRHistory.js %batchid%
)
if "%choice%"=="10" (
    echo Goodbye!
    exit
)

echo.
echo Press any key to continue...
pause >nul
goto :eof