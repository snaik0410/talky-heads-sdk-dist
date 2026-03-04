# sync-from-private.ps1
# Run this script to copy built files from the private repo to the distribution repo

param(
    [string]$PrivateRepoPath = "..\talky-heads-sdk"
)

$ErrorActionPreference = "Stop"

Write-Host "Syncing from private repo: $PrivateRepoPath" -ForegroundColor Cyan

# Verify private repo exists
if (-not (Test-Path $PrivateRepoPath)) {
    Write-Error "Private repo not found at: $PrivateRepoPath"
    exit 1
}

# Build the private repo first
Write-Host "`n1. Building private repo..." -ForegroundColor Yellow
Push-Location $PrivateRepoPath
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    Pop-Location
    exit 1
}
Pop-Location

# Copy dist folder
Write-Host "`n2. Copying dist folder..." -ForegroundColor Yellow
if (Test-Path ".\dist") { Remove-Item -Recurse -Force ".\dist" }
Copy-Item -Recurse "$PrivateRepoPath\dist" ".\dist"

# Copy assets folder
Write-Host "`n3. Copying assets folder..." -ForegroundColor Yellow
if (Test-Path ".\assets") { Remove-Item -Recurse -Force ".\assets" }
Copy-Item -Recurse "$PrivateRepoPath\assets" ".\assets"

# Verify files
Write-Host "`n4. Verifying files..." -ForegroundColor Yellow
$requiredFiles = @(
    ".\dist\talky-heads-sdk.es.js",
    ".\dist\talky-heads-sdk.cjs.js",
    ".\dist\index.d.ts",
    ".\dist\vite-plugin.es.js",
    ".\assets\avatars\Lucy\base.webp",
    ".\assets\avatars\Lucy\rest.webp",
    ".\assets\avatars\Lucy\sprite_manifest.json"
)

$missing = $requiredFiles | Where-Object { -not (Test-Path $_) }
if ($missing.Count -gt 0) {
    Write-Error "Missing required files:`n$($missing -join "`n")"
    exit 1
}

# Show summary
Write-Host "`n✅ Sync complete!" -ForegroundColor Green
Write-Host "`nFiles ready for publishing:" -ForegroundColor Cyan
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules|\.git" } | 
    Select-Object @{N='Path';E={$_.FullName.Replace($PWD.Path + '\', '')}} |
    Format-Table -AutoSize

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Update version in package.json"
Write-Host "  2. git add -A && git commit -m 'Release vX.Y.Z'"
Write-Host "  3. git tag vX.Y.Z"
Write-Host "  4. git push && git push --tags"
Write-Host "  5. npm publish --access public"
