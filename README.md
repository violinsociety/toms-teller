# Toms Teller

A minimalist cooking blog for sharing recipes.

## Setup Instructions

### 1. Domain & GitHub Setup

1. **Purchase Domain**: Buy toms-teller.de from your preferred registrar

2. **Create GitHub Account**: If you don't have one already

3. **Create Repository**: Create a new public repository named `toms-teller`

4. **Upload Files**: Upload all the files in this package to your repository

5. **Set Up GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: main branch
   - Add your custom domain: www.toms-teller.de
   - Check "Enforce HTTPS"

6. **Configure DNS**:
   - Add A records pointing to GitHub IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Add CNAME record for www pointing to your GitHub Pages URL (username.github.io)

### 2. Folder Structure

Ensure your repository has the following structure:

```
toms-teller/
├── index.html
├── admin.html
├── styles/
│   └── main.css
├── scripts/
│   ├── main.js
│   └── admin.js
├── images/
│   ├── recipes/  (Create this folder)
│   └── placeholder.jpg  (Add a generic food image here)
├── recipes/
│   ├── index.json
│   └── (recipe JSON files will be added here)
└── README.md
```

### 3. Adding Recipes

Since this is a static site on GitHub Pages, we can't use server-side code to save recipes dynamically. Here's a workaround:

1. **Create Recipe Images**:
   - Take photos with your iPhone
   - Resize and optimize them (aim for 1200px width max)
   - Save them in the `images/recipes/` folder with the same filename as their corresponding JSON

2. **Create Recipe JSON**:
   - Use the admin form at `admin.html` to format your recipe
   - When you click "Save Recipe," you'll see the formatted JSON in the browser console
   - Create a new file in the `recipes/` folder with the recipe ID as the filename (e.g., `recipes/kuerbissuppe-mit-kokosmilch-1709720512345.json`)
   - Add the recipe to `recipes/index.json` (this is the master list of all recipes)

3. **Commit and Push**:
   - Commit your changes and push to GitHub
   - GitHub Pages will automatically update your site

### 4. Maintenance Tips

- **Image Optimization**: Always compress images before uploading (use a tool like [TinyPNG](https://tinypng.com/))
- **Total Size**: Keep an eye on the total repository size (under 1GB for GitHub Pages)
- **Backups**: Regularly back up your recipe JSON files

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No build tools or frameworks required
- Responsive design that works on mobile and desktop

## Admin Page

The admin page is accessible at `admin.html`. There's no login protection – it's hidden by a tiny dot in the footer of the website.

The admin page currently simulates saving recipes. To actually save a recipe:

1. Fill out the form
2. Open browser console (F12)
3. Click "Save Recipe"
4.
