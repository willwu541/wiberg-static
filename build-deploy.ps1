$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist = Join-Path $root "_site-dist"

if (Test-Path $dist) {
  Remove-Item $dist -Recurse -Force
}
New-Item -ItemType Directory -Path $dist | Out-Null

# Directories that are NOT part of the live website
$exclude = @(
  "_site-dist",
  ".git",
  ".github",
  ".cursor",
  "node_modules",
  "wiberg-catalogs1",
  "wiberg-catalogs",
  "catalog 1",
  "docs",
  "tools",
  "public"
)
# Also exclude any directory with non-ASCII characters (Chinese asset folders)
$excludeNonAscii = $true

# Copy all top-level directories (except excluded ones)
Get-ChildItem $root -Directory | Where-Object {
  $exclude -notcontains $_.Name -and
  ($_.Name -match '^[\x20-\x7E]+$')
} | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $dist $_.Name) -Recurse -Force
  Write-Host "  + $($_.Name)/"
}

# Copy all top-level files (html, xml, txt, ico, etc.)
Get-ChildItem $root -File | Where-Object {
  $_.Name -ne "build-deploy.ps1" -and
  $_.Name -notmatch "^_" -and
  $_.Name -notmatch "\.(py|md)$" -and
  $_.Name -ne ".gitignore"
} | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $dist $_.Name) -Force
  Write-Host "  + $($_.Name)"
}

$sitemapSrc = Join-Path $root "public\sitemap.xml"
if (Test-Path $sitemapSrc) {
  Copy-Item $sitemapSrc (Join-Path $dist "sitemap.xml") -Force
  Write-Host "  + sitemap.xml (from public/)"
}

# Summary
$fileCount = (Get-ChildItem $dist -Recurse -File).Count
$sizeMB = [math]::Round((Get-ChildItem $dist -Recurse -File | Measure-Object Length -Sum).Sum / 1MB, 2)
# Remove non-web files that slipped in
Get-ChildItem $dist -Recurse -File -Include *.pptx,*.psd,*.ai,*.sketch | Remove-Item -Force

Write-Host ""
Write-Host "Deploy folder ready: $dist"
Write-Host "Files: $fileCount | Size: $sizeMB MB"
Write-Host ""
Write-Host "Upload the CONTENTS of _site-dist/ to Hostinger public_html/"
