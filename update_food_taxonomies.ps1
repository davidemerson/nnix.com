# PowerShell script to update food files to use taxonomies
$contentFoodPath = "c:\Users\DavidEmerson\OneDrive - SolCyber Managed Security Services\Desktop\nnix.com\content\food"

# Get all .md files except _index.md
$markdownFiles = Get-ChildItem -Path $contentFoodPath -Filter "*.md" | Where-Object { $_.Name -ne "_index.md" }

foreach ($file in $markdownFiles) {
    Write-Host "Updating $($file.Name)..."
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Replace [extra] category with [taxonomies] foodcategory
    $content = $content -replace '\[extra\]\s*\n\s*category = "([^"]+)"', '[taxonomies]`n  foodcategory = ["$1"]'
    
    # Write back to file
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "All files updated!"
