# MongoDB Installation Helper Script
# Run this in PowerShell as Administrator

Write-Host "🚀 MongoDB Installation Helper" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  Please run this script as Administrator" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Check if MongoDB is already installed
Write-Host "`n🔍 Checking for existing MongoDB installation..." -ForegroundColor Cyan

$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "✅ MongoDB service found: $($mongoService.Status)" -ForegroundColor Green
    if ($mongoService.Status -eq "Running") {
        Write-Host "🎉 MongoDB is already running!" -ForegroundColor Green
    } else {
        Write-Host "🔄 Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service MongoDB
        Write-Host "✅ MongoDB service started!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ MongoDB not found. Installation required." -ForegroundColor Red
    
    Write-Host "`n📥 Opening MongoDB download page..." -ForegroundColor Cyan
    Start-Process "https://www.mongodb.com/try/download/community"
    
    Write-Host "`n📋 Installation Instructions:" -ForegroundColor Yellow
    Write-Host "1. Download the Windows .msi installer" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Choose 'Complete' installation" -ForegroundColor White
    Write-Host "4. ✅ Install as Windows Service (IMPORTANT!)" -ForegroundColor White
    Write-Host "5. ✅ Install MongoDB Compass (optional but recommended)" -ForegroundColor White
    Write-Host "6. Complete the installation" -ForegroundColor White
    Write-Host "7. Run this script again to verify installation" -ForegroundColor White
    
    Write-Host "`n⏳ Waiting for installation completion..." -ForegroundColor Cyan
    Write-Host "Press any key after completing the installation..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Test MongoDB connection
Write-Host "`n🧪 Testing MongoDB connection..." -ForegroundColor Cyan

try {
    $testConnection = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "✅ MongoDB is responding on port 27017" -ForegroundColor Green
        
        # Test with mongosh if available
        $mongoshPath = Get-Command mongosh -ErrorAction SilentlyContinue
        if ($mongoshPath) {
            Write-Host "✅ MongoDB Shell (mongosh) is available" -ForegroundColor Green
        } else {
            Write-Host "⚠️  MongoDB Shell not in PATH. Installation may need completion." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Cannot connect to MongoDB on port 27017" -ForegroundColor Red
        Write-Host "💡 Try starting the service: Start-Service MongoDB" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing connection: $($_.Exception.Message)" -ForegroundColor Red
}

# Final instructions
Write-Host "`n🎯 Next Steps:" -ForegroundColor Green
Write-Host "1. Navigate to your backend directory" -ForegroundColor White
Write-Host "2. Run: npm run setup-mongodb" -ForegroundColor White
Write-Host "3. Choose option 2 (Local MongoDB)" -ForegroundColor White
Write-Host "4. Start your backend: npm run dev" -ForegroundColor White

Write-Host "`n🔗 Useful Commands:" -ForegroundColor Cyan
Write-Host "Check service status: Get-Service MongoDB" -ForegroundColor White
Write-Host "Start service: Start-Service MongoDB" -ForegroundColor White
Write-Host "Stop service: Stop-Service MongoDB" -ForegroundColor White
Write-Host "Connect to MongoDB: mongosh" -ForegroundColor White

Write-Host "`n✨ Installation helper complete!" -ForegroundColor Green