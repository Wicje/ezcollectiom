# Glint - Premium E-Commerce Website

A premium, fast, and modern e-commerce storefront powered by Next.js and Google Sheets as the database.

## Architecture

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Database**: Google Sheets (via Google Sheets API)
- **State Management**: Zustand (for Client-side Cart)

## Using Google Sheets as a Database

The application fetches products directly from your Google Sheet without needing a dedicated backend database.

### 1. How to Mark Products as "Premium" or "New Arrivals" (Featured)

On the home page, the "Premium Bags", "New Arrivals Footwear", and "Latest Drops Jackets" sections display specific items. We filter these by looking at the `featured` column in your Google Sheet.

**Steps to show an item on the home page:**
1. Go to your `Products` sheet.
2. Find the product you want to feature.
3. In the **`featured`** column, type exactly `TRUE` for that row.
4. Ensure the **`category`** column matches one of the following exactly (case-sensitive): `Shoes`, `Bags`, or `Jackets`. 
   - Bags with `featured = TRUE` appear in "Premium Bags".
   - Shoes with `featured = TRUE` appear in "New Arrivals Footwear".
   - Jackets with `featured = TRUE` appear in "Latest Drops Outerwear".

*Note: It will show up to 4 items per category. If you want a different product to show up, make sure it has TRUE and change others to FALSE.*

### 2. Using Google Drive Images

Yes, you can absolutely use Google Drive to store and serve your images!

**How to get a direct image link from Google Drive:**
1. Upload your image to a folder in Google Drive.
2. Right-click the image and select **Share**.
3. Under "General access", change it to **"Anyone with the link"**.
4. Click **Copy link**. You'll get a link like:
   `https://drive.google.com/file/d/1aBcD2eFgH3iJ4kL5mN6oP7qR8sT9uV/view?usp=sharing`
5. **CRITICAL STEP:** You must modify the link to be a direct download/view link before pasting it into your Google Sheet.
   - Extract the File ID from the link (the random letters and numbers between `/d/` and `/view`). In the example above, it's `1aBcD2eFgH3iJ4kL5mN6oP7qR8sT9uV`
   - Create your new direct link using this format:
     `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`
   - Example result:
     `https://drive.google.com/uc?export=view&id=1aBcD2eFgH3iJ4kL5mN6oP7qR8sT9uV`
6. Paste this modified link into the `main_images` or `variants` column in your Google Sheet.
   - For multiple images, separate them with commas.

*Alternatives:* You can also use image hosting services like Imgur, Cloudinary, AWS S3, or Shopify CDN Links, as long as the URL ends in `.jpg`, `.png`, `.webp`, etc., or is a direct public image view link.

## Modifying Categories

If you wish to change categories, just update the string in the "category" column in your sheet. 
To add it to the website's Navigation Menu, you will need to edit `components/Navbar.tsx` (the mobile and desktop navs) and add your new category URL, such as `<Link href="/shop?category=Accessories">Accessories</Link>`.
