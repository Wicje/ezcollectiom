# Vendor Setup Guide: Zinnes E-Commerce

Welcome! This guide is written so ANYONE can manage this store without needing to touch a single line of code. Your entire store's database is just a Google Sheet.

If you can use Excel, you can run this store!

---

## Step 1: Set Up Your Google Sheet

1. Go to Google Sheets and create a **Blank Spreadsheet**.
2. In the very first row (Row 1), create these **exact** column headers. (Make sure they are lowercase and spelled exactly like this):

| id | name | category | description | base_price | variants | main_images | stock | featured | rating |
|---|---|---|---|---|---|---|---|---|---|

Here is what each column means:
- **`id`**: A unique code for your product. (e.g., `P001`, `SHOES-1`)
- **`name`**: The name of the product. (e.g., `Zinnes Running Shoes`)
- **`category`**: The category of the product. Use `Shoes`, `Bags`, or `Jackets`. (Make sure to spell it exactly like this if you want it to show on the Home Page's featured section).
- **`description`**: A text description of the product.
- **`base_price`**: The price in dollars. (e.g., `120`)
- **`variants`**: (Optional) This lets users pick sizes/colors. Copy and paste this exact format:
  `[{"size": "M", "color": "Black", "price": 120}]`
  If you have multiple, separate them by commas inside the brackets:
  `[{"size": "M", "color": "Black", "price": 120}, {"size": "L", "color": "Black", "price": 130}]`
- **`main_images`**: A link to your product image. (See Step 2 below). If you have multiple images, separate the links with commas.
- **`stock`**: Number of items you have. (e.g., `100`). If you type `0`, it will say "Out of Stock".
- **`featured`**: Type `TRUE` (in all caps) if you want this product to show up on the Front Page. Type `FALSE` if you just want it to be in the "Shop" page.
- **`rating`**: A number from `1` to `5`. (e.g. `4.5` or `5.0`).

---

## Step 2: How to Add Images from Google Drive

You can use Google Drive to host your product images for free.

1. Upload your product photo into Google Drive.
2. Right-click the photo in Google Drive and click **Share**.
3. Under "General access", change it from "Restricted" to **"Anyone with the link"**.
4. Click **Copy link**. You will get a link that looks like this:
   `https://drive.google.com/file/d/1A-b2C3d4E5f6G7h8I9j0K_L/view?usp=sharing`
5. **IMPORTANT:** You cannot paste that link directly. You must change it slightly so the website can download the image.
   - Look at the link. Copy the long random code between `/d/` and `/view`.
   - In our example, the code is: `1A-b2C3d4E5f6G7h8I9j0K_L`
   - Now, paste that code at the end of this special link format:
     `https://drive.google.com/uc?export=view&id=`
   - Your final link will look like this:
     `https://drive.google.com/uc?export=view&id=1A-b2C3d4E5f6G7h8I9j0K_L`
6. Paste *that* final link into your **`main_images`** column in the Google Sheet.

*(Pro Tip: You can also just use links from Imgur, Shopify, or anywhere else as long as it ends in .jpg or .png!)*

---

## Step 3: Connect Your Spreadsheet to the Website

1. In your Google Sheet, click **File** (at the top left) -> **Share** -> **Publish to web**.
2. A window will pop up. 
   - Under "Link", change "Web page" to **Comma-separated values (.csv)**.
   - Click the green **Publish** button.
   - Click "OK" when it asks if you're sure.
3. The box will now give you a long link that ends in `.csv`. Copy that link!
4. Take that `.csv` link and give it to your developer, OR if you know how to edit code:
   - Go to the file `lib/sheets.ts` on line 11, and paste it where it says `"YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE"`.

---

## Step 4: Configure WhatsApp For Orders

When a customer finishes checkout, it sends the order straight to your WhatsApp.

1. Open the file `app/checkout/page.tsx`
2. Scroll to Line 94. You will see:
   `const MY_WHATSAPP_NUMBER = "2340000000000";`
3. Change the numbers inside the quotes to your actual WhatsApp phone number including the country code (don't use `+`, just the numbers).
   - Example for US: `"15551234567"`
   - Example for UK: `"447712345678"`

---

## Step 5: How Home Page Categories Work

Your website's Home Page has 3 special sections: "Premium Bags", "New Arrivals Footwear", and "Latest Drops Jackets".

If you want a product to show up in those sections:
1. Make sure **`featured`** is set to `TRUE`.
2. Make sure the **`category`** is spelled *exactly* like `Bags`, `Shoes`, or `Jackets`.

You can have dozens of products in your sheet, but the Home Page will only pick the first 4 it finds for each category that are marked as `TRUE` for featured!
