# Content validation script
$contentPath = "c:\Users\DavidEmerson\OneDrive - SolCyber Managed Security Services\Desktop\nnix.com\content"

function Test-ContentFile {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $issues = @()
    
    # Check for required frontmatter
    if (-not ($content -match '^\+\+\+[\s\S]*?\+\+\+')) {
        $issues += "Missing frontmatter"
    }
    
    # Check for title
    if (-not ($content -match 'title\s*=\s*"[^"]+"')) {
        $issues += "Missing or malformed title"
    }
    
    # Check for date format
    if ($content -match 'date\s*=\s*([^\n]+)') {
        $dateValue = $matches[1].Trim()
        if (-not ($dateValue -match '^\d{4}-\d{2}-\d{2}$')) {
            $issues += "Invalid date format (should be YYYY-MM-DD)"
        }
    }
    
    return $issues
}

# Validate all content files
Get-ChildItem -Path $contentPath -Recurse -Filter "*.md" | ForEach-Object {
    $issues = Test-ContentFile $_.FullName
    if ($issues.Count -gt 0) {
        Write-Host "Issues in $($_.Name):" -ForegroundColor Yellow
        $issues | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    }
}
