import os
import re
from pathlib import Path
from datetime import datetime

def convert_gmi_to_md(input_file, output_file, category=None):
    """Convert a Gemini .gmi file to Markdown with Zola frontmatter"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title from first # heading
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else Path(input_file).stem.replace('_', ' ').title()
    
    # Remove the Gemini home link at the end
    content = re.sub(r'\n*=> gemini://nnix\.com/index\.gmi Home\s*$', '', content)
    
    # Convert Gemini headers to Markdown (# stays the same, ## stays the same, etc.)
    # Gemini format is already compatible with Markdown for headers
    
    # Convert Gemini links to markdown links (if any exist beyond the home link)
    # Pattern: => URL text becomes [text](URL)
    content = re.sub(r'^=> ([^\s]+)\s+(.+)$', r'[\2](\1)', content, flags=re.MULTILINE)
    
    # Create slug from filename
    slug = Path(input_file).stem.replace('_', '-')
    
    # Generate description from first paragraph or ingredients section
    description = ""
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.strip() and not line.startswith('#'):
            # Look for ingredients section or first substantial text
            if 'Ingredients' in content:
                # Find the ingredients section and use the first few ingredients as description
                ingredients_start = content.find('## Ingredients')
                if ingredients_start != -1:
                    ingredients_section = content[ingredients_start:].split('\n\n')[0]
                    ingredients_lines = [l.strip() for l in ingredients_section.split('\n') if l.strip().startswith('*')]
                    if ingredients_lines:
                        description = f"Recipe featuring {ingredients_lines[0][2:].split(',')[0].lower()}"
                        break
            else:
                description = line.strip()[:100] + "..." if len(line.strip()) > 100 else line.strip()
                break
    
    # Create the frontmatter
    frontmatter = f"""+++
title = "{title}"
slug = "{slug}"
date = {datetime.now().strftime('%Y-%m-%d')}"""
    
    if description:
        frontmatter += f'\ndescription = "{description}"'
    
    if category:
        frontmatter += f'\n[extra]\n  category = "{category}"'
    
    frontmatter += "\n+++"
    
    # Combine frontmatter and content
    full_content = frontmatter + "\n\n" + content.strip()
    
    # Write the output file
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(full_content)

def main():
    # Base paths
    base_path = Path(r"c:\Users\DavidEmerson\OneDrive - SolCyber Managed Security Services\Desktop\nnix.com")
    food_temp_path = base_path / "food_temp" / "food"
    content_food_path = base_path / "content" / "food"
    
    # Category mappings
    categories = {
        'bread_pastry': 'bread-pastry',
        'desserts_snacks': 'desserts-snacks', 
        'dips_spreads': 'dips-spreads',
        'drinks': 'drinks',
        'main': 'main'
    }
    
    # Convert each category
    for category_dir, category_slug in categories.items():
        category_path = food_temp_path / category_dir
        if not category_path.exists():
            continue
            
        print(f"Processing {category_dir}...")
        
        # Convert all .gmi files in this category (except index.gmi)
        for gmi_file in category_path.glob("*.gmi"):
            if gmi_file.name == "index.gmi":
                continue
                
            output_file = content_food_path / f"{gmi_file.stem}.md"
            print(f"  Converting {gmi_file.name} -> {output_file.name}")
            
            try:
                convert_gmi_to_md(gmi_file, output_file, category_slug)
            except Exception as e:
                print(f"    Error converting {gmi_file.name}: {e}")

if __name__ == "__main__":
    main()
