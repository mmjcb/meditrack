import json
import random

# --- Realistic Pricing and Variation Constants ---

# Tier 1: Low-cost (e.g., basic generics, vitamins) - P20 to P250
# Tier 2: Mid-cost (e.g., branded cold meds, common antibiotics) - P150 to P500
# Tier 3: High-cost (e.g., specialized meds, branded supplements) - P400 to P1200
def get_realistic_price(product_name, base_tier):
    base_price = random.randint(base_tier[0], base_tier[1])
    
    # Adjust for brand/generic/form
    if "Generic" in product_name or "Paracetamol" in product_name:
        base_price *= 0.8 # Lower price for generics
    elif "Syrup" in product_name or "Suspension" in product_name:
        base_price *= 1.3 # Higher price for liquid forms (often larger volumes)
    elif "Cream" in product_name or "Gel" in product_name:
        base_price *= 1.1 # Moderate adjustment for topical
        
    # Ensure minimum price is P50 for variety
    return f"₱{max(50, round(base_price / 10) * 10)}.00"

# Dosage forms for diversification
DOSAGE_FORMS = {
    "tablet": ["100mg", "250mg", "500mg"],
    "capsule": ["10mg", "20mg", "40mg"],
    "syrup": ["60ml", "120ml", "250ml"],
    "topical": ["10g Cream", "30g Ointment", "50g Gel"],
    "suspension": ["100ml Suspension", "200ml Suspension"]
}

# --- Enhanced Categories with Dosage Info and Pricing Tiers ---
categories = {
    "Pain Relief": {
        "icon": "https://cdn-icons-png.flaticon.com/512/387/387630.png",
        "products": [("Paracetamol", DOSAGE_FORMS["tablet"], (20, 150)), ("Ibuprofen", DOSAGE_FORMS["tablet"], (50, 200)), ("Naproxen Generic", DOSAGE_FORMS["tablet"], (100, 300)), ("Mefenamic Acid", DOSAGE_FORMS["tablet"], (10, 80))],
    },
    "Cough & Cold": {
        "icon": "https://cdn-icons-png.flaticon.com/256/2877/2877806.png",
        "products": [("Ambroxol", DOSAGE_FORMS["syrup"], (150, 350)), ("Carbocisteine", DOSAGE_FORMS["syrup"], (100, 300)), ("Phenylpropanolamine+Chlorphenamine", DOSAGE_FORMS["tablet"], (150, 400)), ("Solmux Advance", DOSAGE_FORMS["capsule"], (200, 500))],
    },
    "Vitamins & Supplements": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3274/3274085.png",
        "products": [("Sodium Ascorbate", DOSAGE_FORMS["capsule"], (200, 600)), ("Vitamin B Complex", DOSAGE_FORMS["tablet"], (150, 450)), ("Multivitamins + Iron", DOSAGE_FORMS["capsule"], (300, 1000)), ("Calcium Carbonate", DOSAGE_FORMS["tablet"], (180, 550))],
    },
    "Antibiotics": {
        "icon": "https://cdn-icons-png.flaticon.com/512/11469/11469427.png",
        "products": [("Amoxicillin", DOSAGE_FORMS["capsule"], (300, 800)), ("Ciprofloxacin", DOSAGE_FORMS["tablet"], (400, 900)), ("Metronidazole", DOSAGE_FORMS["tablet"], (250, 700)), ("Azithromycin", DOSAGE_FORMS["tablet"], (500, 1200))],
    },
    "Digestive Health": {
        "icon": "https://cdn-icons-png.flaticon.com/256/10154/10154425.png",
        "products": [("Omeprazole", DOSAGE_FORMS["capsule"], (100, 350)), ("Loperamide", DOSAGE_FORMS["capsule"], (50, 200)), ("Antacid Suspension", DOSAGE_FORMS["suspension"], (150, 400))],
    },
    "Skin Care": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3789/3789972.png",
        "products": [("Clindamycin Gel", DOSAGE_FORMS["topical"], (200, 500)), ("Miconazole Cream", DOSAGE_FORMS["topical"], (100, 300)), ("Hydrocortisone Topical", DOSAGE_FORMS["topical"], (80, 250))],
    },
    "Diabetes": {
        "icon": "https://cdn-icons-png.flaticon.com/512/7350/7350822.png",
        "products": [("Metformin", DOSAGE_FORMS["tablet"], (250, 700)), ("Gliclazide", DOSAGE_FORMS["tablet"], (300, 850))],
    },
    "Heart & Blood": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3595/3595788.png",
        "products": [("Losartan", DOSAGE_FORMS["tablet"], (300, 800)), ("Amlodipine", DOSAGE_FORMS["tablet"], (200, 600)), ("Atorvastatin", DOSAGE_FORMS["tablet"], (400, 1200))],
    },
    "Allergy & Immunity": {
        "icon": "https://cdn-icons-png.flaticon.com/512/2865/2865526.png",
        "products": [("Cetirizine", DOSAGE_FORMS["tablet"], (50, 200)), ("Loratadine", DOSAGE_FORMS["tablet"], (80, 250)), ("Diphenhydramine", DOSAGE_FORMS["syrup"], (100, 300))],
    },
    "Eye & Ear": {
        "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJhiZeAR1ioj5jQEfe4zbutX9dEu6kteEVqMGTkDye9ih_Gz8iWas_9dthCT9nqXWOC4&usqp=CAU",
        "products": [("Artificial Tears", DOSAGE_FORMS["topical"], (150, 400)), ("Chloramphenicol Eye Drops", DOSAGE_FORMS["topical"], (80, 200))],
    },
}

# --- THE COMPLETE DATA LISTS ---

# Pharmacies with logos
pharmacies = [
    {"name": "Mercury Drug", "logo": "https://static.wixstatic.com/media/d3a435_c2c53366eba94bd7bc941fa602765ed0~mv2.webp"},
    {"name": "Watsons Philippines", "logo": "https://i.pinimg.com/564x/b6/33/06/b63306212a347b08eb84408cd92655c5.jpg"},
    {"name": "Southstar Drug", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT740UQreYJYVgpEwBHV55MHbgHBqEzExZpzQ&s"},
    {"name": "The Generics Pharmacy", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsmm3Nf6klIwH8UmmMYdkZUCOgPUNJ0OxQ6w&s"},
    {"name": "Rose Pharmacy", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_33agw0k2QGLIqFCuv2xh0fpNVVDk1cFOg&s"},
    {"name": "MedExpress Pharmacy", "logo": "https://media.pickaroo.com/media/merchant_logos/2020/10/18/CV2cxRZhe7Ei6MjtXxxztD.jpg"},
    {"name": "Generika Drugstore", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi9SewLw5S6kJOHLvsVFd39Nfu2Uwi3uJ9xQ&s"},
    {"name": "Botikang Pinoy", "logo": "https://media.licdn.com/dms/image/v2/C4E0BAQHIv1qEmvQyHg/company-logo_200_200/company-logo_200_200/0/1630620492223/botikang_pinoy_inc_logo?e=2147483647&v=beta&t=FRZ1Luf2if54PaI7hcOgNeAh9KSew7tM3nMuF-ZZ7QI"}
]

# Well-known Philippine manufacturers
manufacturers = [
    "Unilab",
    "Abbott Laboratories Philippines",
    "GlaxoSmithKline Philippines",
    "AstraZeneca Philippines",
    "Bauch (Phils) Laboratories Corp.",
    "Pfizer Philippines",
    "Johnson & Johnson Philippines",
    "Mabuhay Pharmaceuticals",
    "Pharmaessentia Philippines",
    "Roche Philippines"
]

# Streets and barangays in Iloilo City
streets = ["Ledesma St.", "Iznart St.", "Jalandoni St.", "Luna St.", "Guanco St.", "A. Luna St.", "Mabini St.", "Rizal St.", "Bonifacio St.", "Del Pilar St."]
barangays = ["Molo", "Mandurriao", "Jaro", "La Paz", "Arevalo", "City Proper", "Lapuz", "Villa de Arevalo"]

# Stock statuses
availability_options = ["In Stock", "Limited", "Out of Stock"]


# --- Product Generation Loop ---
products_3000 = []
for i in range(3000):
    category_name = random.choice(list(categories.keys()))
    category_data = categories[category_name]

    # Select a product and its specific pricing tier
    # The structure is (base_name, dosage_list, pricing_tier)
    product_base_name, product_dosages, pricing_tier = random.choice(category_data["products"])
    
    # Select a random dosage/form
    # NOTE: To make sure the dosage variation is relevant to the product, 
    # we use the list provided in the category's product tuple (product_dosages).
    dosage_variation = random.choice(product_dosages)
    
    # Construct the full product name
    product_name = f"{product_base_name} {dosage_variation}"
    
    # Calculate price based on logic
    price = get_realistic_price(product_name, pricing_tier)
    
    # Random selection for location, manufacturer, etc.
    pharmacy = random.choice(pharmacies)
    street = random.choice(streets)
    barangay = random.choice(barangays)
    pharmacy_location = f"{street}, {barangay}, Iloilo City, Philippines"
    manufacturer = random.choice(manufacturers)
    availability = random.choice(availability_options)
    product_image = f"https://via.placeholder.com/150?text={product_name.replace(' ','+')}"
    
    # Overview and other descriptive fields
    overview = f"{product_name} is used for the treatment of conditions related to {category_name.lower()}."
    usage = "Always consult a doctor. Take as prescribed. Do not exceed the recommended dose."
    how_it_works = f"{product_name} works by providing targeted relief for {category_name.lower()} symptoms."
    side_effects = "May cause mild nausea or dizziness in some individuals. Stop use and consult a doctor if severe allergic reactions occur."


    products_3000.append({
        "id": i+1,
        "product_name": product_name,
        "price": price,
        "pharmacy_name": pharmacy["name"],
        "pharmacy_logo": pharmacy["logo"],
        "pharmacy_location": pharmacy_location,
        "manufacturer": manufacturer,
        "availability": availability,
        "category": category_name,
        "category_icon": category_data.get("icon"), 
        "product_image": product_image,
        "overview": overview,
        "usage_and_benefits": usage,
        "how_it_works": how_it_works,
        "side_effects": side_effects
    })  

# Output File Path
file_path = 'src/data/api-dataset.json' 
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products_3000, f, indent=2, ensure_ascii=False)

print("Saved JSON file at:", file_path)