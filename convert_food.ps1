# PowerShell script to convert .gmi files to markdown
$basePath = "c:\Users\DavidEmerson\OneDrive - SolCyber Managed Security Services\Desktop\nnix.com"
$foodTempPath = Join-Path $basePath "food_temp\food"
$contentFoodPath = Join-Path $basePath "content\food"

# Category mappings
$categories = @{
    'bread_pastry' = 'bread-pastry'
    'desserts_snacks' = 'desserts-snacks'
    'dips_spreads' = 'dips-spreads'
    'drinks' = 'drinks'
    'main' = 'main'
}

function Convert-GmiToMd {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [string]$Category
    )
    
    # Read the .gmi file
    $content = Get-Content $InputFile -Raw -Encoding UTF8
    
    # Extract title from first # heading
    if ($content -match '^# (.+)$') {
        $title = $matches[1]
    } else {
        $title = (Get-Item $InputFile).BaseName -replace '_', ' '
        $title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
    }
    
    # Remove the Gemini home link
    $content = $content -replace '\n*=> gemini://nnix\.com/index\.gmi Home\s*$', ''
    
    # Create slug from filename
    $slug = (Get-Item $InputFile).BaseName -replace '_', '-'
    
    # Generate description
    $description = ""
    if ($content -match '## Ingredients.*?\n\* ([^,\n]+)') {
        $description = "Recipe featuring $($matches[1].ToLower())"
    }
    
    # Create frontmatter
    $frontmatter = @"
+++
title = "$title"
slug = "$slug"
date = 2025-06-26
"@
    
    if ($description) {
        $frontmatter += "`ndescription = `"$description`""
    }
    
    if ($Category) {
        $frontmatter += "`n[extra]`n  category = `"$Category`""
    }
    
    $frontmatter += "`n+++"
    
    # Combine frontmatter and content
    $fullContent = $frontmatter + "`n`n" + $content.Trim()
    
    # Ensure output directory exists
    $outputDir = Split-Path $OutputFile -Parent
    if (!(Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    # Write the output file
    [System.IO.File]::WriteAllText($OutputFile, $fullContent, [System.Text.Encoding]::UTF8)
}

# Process each category
foreach ($categoryDir in $categories.Keys) {
    $categoryPath = Join-Path $foodTempPath $categoryDir
    if (!(Test-Path $categoryPath)) {
        continue
    }
    
    Write-Host "Processing $categoryDir..."
    
    # Get all .gmi files except index.gmi
    $gmiFiles = Get-ChildItem -Path $categoryPath -Filter "*.gmi" | Where-Object { $_.Name -ne "index.gmi" }
    
    foreach ($gmiFile in $gmiFiles) {
        $outputFile = Join-Path $contentFoodPath "$($gmiFile.BaseName).md"
        Write-Host "  Converting $($gmiFile.Name) -> $($gmiFile.BaseName).md"
        
        try {
            Convert-GmiToMd -InputFile $gmiFile.FullName -OutputFile $outputFile -Category $categories[$categoryDir]
        }
        catch {
            Write-Host "    Error converting $($gmiFile.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "Conversion complete!"
