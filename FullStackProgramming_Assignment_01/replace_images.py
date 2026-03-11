import glob

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements.items():
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

html_files = glob.glob('*.html')

global_replacements = {
    'https://placehold.co/150x50/ffffff/555555?text=OceanicSpa': 'extracted_assets/oceanic.jpg',
    'https://placehold.co/150x50/ffffff/555555?text=CalderaSpas': 'extracted_assets/caldera.jpg',
    'https://placehold.co/150x50/ffffff/555555?text=IslandSpas': 'extracted_assets/island.jpg',
    
    'https://placehold.co/400x250/cccccc/333333?text=Company+Showroom': 'extracted_assets/showroom.jpg',
    
    '<img src="https://placehold.co/300x300/e6e6e6/666666?text=Portrait" alt="Jennifer Lawrence" class="w-full h-full object-cover">': '<img src="extracted_assets/team1.jpg" alt="Jennifer Lawrence" class="w-full h-full object-cover">',
    
    'https://placehold.co/200x150/ffffff/777777?text=Spa+Top+View': 'extracted_assets/product1.jpg',
    'https://placehold.co/200x150/ffffff/777777?text=Spa+Side+View': 'extracted_assets/product2.jpg',
    'https://placehold.co/200x150/ffffff/777777?text=Blue+Spa': 'extracted_assets/product3.jpg',
    
    'https://placehold.co/50x50/f0f0f0/666666?text=Unit': 'extracted_assets/thumb1.jpg'
}

badges_old = '''<img src="https://placehold.co/150x40/f39c12/ffffff?text=HUGE+DISCOUNTS" alt="Huge Discounts" class="mb-1">
                    <img src="https://placehold.co/150x40/2ecc71/ffffff?text=SHOP+EARLY" alt="Shop Early">'''
badges_new = '''<img src="extracted_assets/badges.jpg" alt="Badges">'''

for f in html_files:
    replace_in_file(f, global_replacements)
    replace_in_file(f, {badges_old: badges_new})
    
print('Replaced basic global images.')
