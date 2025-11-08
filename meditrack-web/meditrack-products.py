import json
import random

# Categories with icons and sample brand/generic products
categories = {
    "Pain Relief": {
        "icon": "https://cdn-icons-png.flaticon.com/512/387/387630.png",
        "products": ["Advil", "Alaxan", "Biogesic", "Cemol", "Excedrin", "Medicol", "Neozep Pain Relief", "Tylenol", "Motrin", "Solmux Pain Relief"]
    },
    "Cough & Cold": {
        "icon": "https://cdn-icons-png.flaticon.com/256/2877/2877806.png",
        "products": ["Neozep", "Bioflu", "Ascof", "Solmux", "Decolgen", "Bisolvon", "Vicks VapoRub", "Robitussin", "Strepsils", "Halls"]
    },
    "Vitamins & Supplements": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3274/3274085.png",
        "products": ["Enervon", "Ceelin", "Lactum", "Feroglobin", "Caltrate", "Vitamin C", "Zincovit", "Centrum", "Redoxon", "Seven Seas Cod Liver Oil", "Blackmores Omega-3"]
    },
    "Antibiotics": {
        "icon": "https://cdn-icons-png.flaticon.com/512/11469/11469427.png",
        "products": ["Amoxil", "Flagyl", "Ciprobay", "Clindamycin", "Doxycycline", "Azithromycin", "Levofloxacin", "Cefalexin", "Tobrex", "Bactroban"]
    },
    "Digestive Health": {
        "icon": "https://cdn-icons-png.flaticon.com/256/10154/10154425.png",
        "products": ["Gaviscon", "Diatabs", "Mylanta", "Lactobacillus", "Omeprazole", "Antacid", "Probiotic", "Simethicone", "Pepto-Bismol", "Enzymedica Digest"]
    },
    "Skin Care": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3789/3789972.png",
        "products": ["Betadine", "Hydrocortisone Cream", "Antifungal Cream", "Aloe Vera Gel", "Moisturizer", "Acne Cream", "Cetaphil", "Eucerin", "Vaseline", "Neutrogena Hydro Boost"]
    },
    "Diabetes": {
        "icon": "https://cdn-icons-png.flaticon.com/512/7350/7350822.png",
        "products": ["Glucophage", "Glibenclamide", "Insulin", "Glipizide", "Sitagliptin", "Vildagliptin", "Pioglitazone", "Novorapid", "Humalog", "Tresiba"]
    },
    "Heart & Blood": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3595/3595788.png",
        "products": ["Amlodipine", "Losartan", "Atorvastatin", "Warfarin", "Furosemide", "Simvastatin", "Carvedilol", "Nitrofurantoin", "Clopidogrel", "Bisoprolol"]
    },
    "Allergy & Immunity": {
        "icon": "https://cdn-icons-png.flaticon.com/512/2865/2865526.png",
        "products": ["Antihistamine", "Cetirizine", "Loratadine", "Epinephrine", "Immunoglobulin", "Ventolin", "Fluticasone", "Prednisone", "Allegra", "Nasacort"]
    },
    "Eye & Ear": {
        "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJhiZeAR1ioj5jQEfe4zbutX9dEu6kteEVqMGTkDye9ih_Gz8iWas_9dthCT9nqXWOC4&usqp=CAU",
        "products": ["Artificial Tears", "Ear Drops", "Anti-glaucoma", "Ophthalmic Ointment", "Antibiotic Eye Drops", "Optivar", "Restasis", "Visine", "Zaditor", "Similasan Eye Drops"]
    },
    "Mental Health": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3998/3998035.png",
        "products": ["Sertraline", "Fluoxetine", "Diazepam", "Alprazolam", "Lorazepam", "Escitalopram", "Clonazepam", "Bupropion", "Aripiprazole", "Olanzapine"]
    },
    "Pregnancy & Baby": {
        "icon": "https://cdn-icons-png.flaticon.com/512/5306/5306303.png",
        "products": ["Folic Acid", "Prenatal Vitamins", "Iron Supplements", "Baby Oil", "Diaper Rash Cream", "Enfamil", "Similac", "Nestle NAN", "Aveeno Baby Lotion", "Mustela Baby Cream"]
    },
    "Oral Care": {
        "icon": "https://cdn-icons-png.flaticon.com/512/5715/5715281.png",
        "products": ["Toothpaste", "Mouthwash", "Fluoride Gel", "Dental Floss", "Teeth Whitening", "Listerine", "Sensodyne", "Colgate Plax", "Paradontax", "Biotene"]
    },
    "Hair & Scalp": {
        "icon": "https://cdn-icons-png.flaticon.com/512/3464/3464759.png",
        "products": ["Shampoo", "Hair Oil", "Dandruff Shampoo", "Conditioner", "Hair Serum", "Pantene", "Rejoice", "Head & Shoulders", "Dove Hair Therapy", "Garnier Fructis"]
    },
    "Weight Management": {
        "icon": "https://cdn-icons-png.flaticon.com/512/4899/4899612.png",
        "products": ["Protein Powder", "Meal Replacement", "Fat Burner", "Appetite Suppressant", "L-Carnitine", "Ensure", "SlimFast", "Herbalife", "Muscletech Protein", "GNC Total Lean"]
    }
}

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

# Generate 2000 products
products_3000 = []
for i in range(3000):
    category_name = random.choice(list(categories.keys()))
    category = categories[category_name]
    product_name = random.choice(category["products"]) + f" {random.randint(100,500)}mg"
    price = f"₱{random.randint(20,1000)}.00"
    pharmacy = random.choice(pharmacies)
    street = random.choice(streets)
    barangay = random.choice(barangays)
    pharmacy_location = f"{street}, {barangay}, Iloilo City, Philippines"
    manufacturer = random.choice(manufacturers)
    availability = random.choice(availability_options)
    product_image = f"https://via.placeholder.com/150?text={product_name.replace(' ','+')}"

    overview = f"{product_name} is used for {category_name.lower()}."
    usage = "Take as prescribed. Follow the instructions on the label."
    how_it_works = f"{product_name} works by providing relief for {category_name.lower()} symptoms."
    side_effects = "May cause mild nausea or dizziness in some individuals."

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
        "category_icon": category["icon"],
        "product_image": product_image,
        "overview": overview,
        "usage_and_benefits": usage,
        "how_it_works": how_it_works,
        "side_effects": side_effects
    })
file_path_2000 = 'meditrack_full_2000.json'  # saved in the current folder
with open(file_path_2000, 'w', encoding='utf-8') as f:
    json.dump(products_3000, f, indent=2, ensure_ascii=False)

print("Saved JSON file at:", file_path_2000)
