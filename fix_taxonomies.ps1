# PowerShell script to fix the taxonomy formatting
$contentFoodPath = "c:\Users\DavidEmerson\OneDrive - SolCyber Managed Security Services\Desktop\nnix.com\content\food"

# Get all .md files except _index.md
$markdownFiles = Get-ChildItem -Path $contentFoodPath -Filter "*.md" | Where-Object { $_.Name -ne "_index.md" }

foreach ($file in $markdownFiles) {
    Write-Host "Fixing $($file.Name)..."
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Fix the malformed newline characters
    $content = $content -replace '\[taxonomies\]`n  foodcategory = ', "[taxonomies]`r`n  foodcategory = "
    
    # Write back to file
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "All files fixed!"
