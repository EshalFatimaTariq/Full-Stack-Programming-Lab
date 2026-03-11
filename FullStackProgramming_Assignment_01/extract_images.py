from PIL import Image
import os

# Create an output directory for the cropped assets
out_dir = 'extracted_assets'
os.makedirs(out_dir, exist_ok=True)

try:
    # 1. Company Showroom Image (From 'About us.jpg')
    about_img = Image.open(r'C:\Users\areej\OneDrive\Desktop\FullStackProgramming_Assignment_01\images\About us.jpg')
    
    # We find the showroom image is near the middle. 
    # Because it is a 1920 width, the 1100 container starts at X=410
    # The image is on the right side of the container (approx 1/3 width, so maybe X=1140 to X=1510)
    # The height is around Y=475 to Y=740
    showroom_crop = about_img.crop((1115, 475, 1510, 740))
    showroom_crop.save(f'{out_dir}/showroom.jpg')
    print("Cropped showroom")
    
    # 2. Team Members (From 'About us.jpg')
    # Row starts around Y=980 to Y=1190
    y1, y2 = 980, 1190
    team1 = about_img.crop((410, y1, 660, y2))
    team2 = about_img.crop((685, y1, 935, y2))
    team3 = about_img.crop((960, y1, 1210, y2))
    team4 = about_img.crop((1235, y1, 1485, y2))
    
    team1.save(f'{out_dir}/team1.jpg')
    team2.save(f'{out_dir}/team2.jpg')
    team3.save(f'{out_dir}/team3.jpg')
    team4.save(f'{out_dir}/team4.jpg')
    print("Cropped team members")

    # 3. Product Images (From 'Catagory page.jpg')
    cat_img = Image.open(r'C:\Users\areej\OneDrive\Desktop\FullStackProgramming_Assignment_01\images\Catagory page.jpg')
    
    # Row 1 products: Y=870 to Y= 1070
    p1 = cat_img.crop((710, 870, 960, 1070))
    p2 = cat_img.crop((985, 870, 1235, 1070))
    p3 = cat_img.crop((1260, 870, 1510, 1070))
    
    # Row 2 products: Y=1265 to Y= 1465
    p4 = cat_img.crop((710, 1265, 960, 1465))
    p5 = cat_img.crop((985, 1265, 1235, 1465))
    p6 = cat_img.crop((1260, 1265, 1510, 1465))
    
    p1.save(f'{out_dir}/product1.jpg')
    p2.save(f'{out_dir}/product2.jpg')
    p3.save(f'{out_dir}/product3.jpg')
    p4.save(f'{out_dir}/product4.jpg')
    p5.save(f'{out_dir}/product5.jpg')
    p6.save(f'{out_dir}/product6.jpg')
    print("Cropped products")
    
    # 4. Small Product Thumbnails ('Customers Who Viewed This Also')
    # Located at bottom row around Y=1800
    t1 = cat_img.crop((760, 1795, 860, 1895))
    t1.save(f'{out_dir}/thumb1.jpg')
    t2 = cat_img.crop((960, 1795, 1060, 1895))
    t2.save(f'{out_dir}/thumb2.jpg')
    t3 = cat_img.crop((1160, 1795, 1260, 1895))
    t3.save(f'{out_dir}/thumb3.jpg')
    t4 = cat_img.crop((1360, 1795, 1460, 1895))
    t4.save(f'{out_dir}/thumb4.jpg')
    print("Cropped thumbnails")
    
    # 5. Brands row (From Edit Billing page since it has the huge discounts badges)
    billing_img = Image.open(r'C:\Users\areej\OneDrive\Desktop\FullStackProgramming_Assignment_01\images\Edit Billing Address.jpg')
    
    # The brands row in billing starts roughly Y=1285 to Y=1400 and spans the full 1100 container
    brands_block = billing_img.crop((410, 1285, 1510, 1400))
    brands_block.save(f'{out_dir}/brands_block_all.jpg')
    
    # Separate logos
    oceanic = billing_img.crop((900, 1315, 1070, 1375))
    oceanic.save(f'{out_dir}/oceanic.jpg')
    caldera = billing_img.crop((1100, 1315, 1280, 1375))
    caldera.save(f'{out_dir}/caldera.jpg')
    island = billing_img.crop((1310, 1315, 1490, 1375))
    island.save(f'{out_dir}/island.jpg')
    
    # Huge discounts badge
    badges = billing_img.crop((600, 1300, 850, 1385))
    badges.save(f'{out_dir}/badges.jpg')
    
    print("All final images cropped and saved successfully!")
    
except Exception as e:
    print(f"Error occurred: {e}")
