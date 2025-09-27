# MongoDB Installation Helper Script
# Run this in PowerShell as Administrator

Write-Host "MongoDB Installation Helper" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "WARNING: Please run this script as Administrator" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "SUCCESS: Running as Administrator" -ForegroundColor Green

# Check if MongoDB is already installed
Write-Host "`nChecking for existing MongoDB installation..." -ForegroundColor Cyan

$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "SUCCESS: MongoDB service found - Status: $($mongoService.Status)" -ForegroundColor Green
    if ($mongoService.Status -eq "Running") {
        Write-Host "GREAT: MongoDB is already running!" -ForegroundColor Green
    } else {
        Write-Host "INFO: Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service MongoDB
        Write-Host "SUCCESS: MongoDB service started!" -ForegroundColor Green
    }
} else {
    Write-Host "INFO: MongoDB not found. Installation required." -ForegroundColor Red
    
    Write-Host "`nOpening MongoDB download page..." -ForegroundColor Cyan
    Start-Process "https://www.mongodb.com/try/download/community"
    
    Write-Host "`nInstallation Instructions:" -ForegroundColor Yellow
    Write-Host "1. Download the Windows .msi installer" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Choose 'Complete' installation" -ForegroundColor White
    Write-Host "4. CHECK: Install as Windows Service (IMPORTANT!)" -ForegroundColor White
    Write-Host "5. OPTIONAL: Install MongoDB Compass (GUI tool)" -ForegroundColor White
    Write-Host "6. Complete the installation" -ForegroundColor White
    Write-Host "7. Run this script again to verify installation" -ForegroundColor White
    
    Write-Host "`nPress any key after completing the installation..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Test MongoDB connection
Write-Host "`nTesting MongoDB connection..." -ForegroundColor Cyan

try {
    $testConnection = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "SUCCESS: MongoDB is responding on port 27017" -ForegroundColor Green
        
        # Test with mongosh if available
        $mongoshPath = Get-Command mongosh -ErrorAction SilentlyContinue
        if ($mongoshPath) {
            Write-Host "SUCCESS: MongoDB Shell (mongosh) is available" -ForegroundColor Green
        } else {
            Write-Host "INFO: MongoDB Shell not in PATH. Installation may need completion." -ForegroundColor Yellow
        }
    } else {
        Write-Host "ERROR: Cannot connect to MongoDB on port 27017" -ForegroundColor Red
        Write-Host "TIP: Try starting the service: Start-Service MongoDB" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Error testing connection: $($_.Exception.Message)" -ForegroundColor Red
}

# Final instructions
Write-Host "`nNext Steps:" -ForegroundColor Green
Write-Host "1. Navigate to your backend directory" -ForegroundColor White
Write-Host "2. Run: npm run setup-mongodb" -ForegroundColor White
Write-Host "3. Choose option 2 (Local MongoDB)" -ForegroundColor White
Write-Host "4. Start your backend: npm run dev" -ForegroundColor White

Write-Host "`nUseful Commands:" -ForegroundColor Cyan
Write-Host "Check service status: Get-Service MongoDB" -ForegroundColor White
Write-Host "Start service: Start-Service MongoDB" -ForegroundColor White
Write-Host "Stop service: Stop-Service MongoDB" -ForegroundColor White
Write-Host "Connect to MongoDB: mongosh" -ForegroundColor White

Write-Host "`nInstallation helper complete!" -ForegroundColor Green