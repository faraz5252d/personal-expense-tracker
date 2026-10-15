# Automation Script for Personal Expense Management System
# Pushes code to GitHub and deploys Frontend to Vercel

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Personal Expense Management System - Auto Deployment" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$projectDir = "C:\Users\mohammad faraz\Desktop\personal-expense-tracker"
Set-Location $projectDir

Write-Host "`n[1/3] Pushing to GitHub (faraz5252d/personal-expense-tracker)..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully pushed to GitHub: https://github.com/faraz5252d/personal-expense-tracker" -ForegroundColor Green
} else {
    Write-Host "! If the repo does not exist yet, create it at: https://github.com/new (name: personal-expense-tracker)" -ForegroundColor Red
}

Write-Host "`n[2/3] Deploying Frontend to Vercel..." -ForegroundColor Yellow
Set-Location "$projectDir\frontend"
vercel deploy --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully deployed to Vercel!" -ForegroundColor Green
} else {
    Write-Host "! Run 'vercel login' if authentication is required." -ForegroundColor Yellow
}

Write-Host "`n[3/3] Opening Live Dashboard & Repositories..." -ForegroundColor Yellow
Start-Process "https://github.com/faraz5252d/personal-expense-tracker"
Start-Process "https://dashboard.render.com/select-repo?type=web"

Write-Host "`n✓ Setup Complete!" -ForegroundColor Green
