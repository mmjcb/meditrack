import json
import random
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

JSON_FILENAME = 'src/data/api-dataset.json'
DATA_ENDPOINT_NAME = 'products'

app = Flask(__name__)
CORS(app)

with open('src/data/api-dataset.json', 'r', encoding='utf-8') as f:
    MASTER_PRODUCTS = json.load(f)
    
def load_data():
    try:
        with open(JSON_FILENAME, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"✅ Loaded {len(data)} records")
            return data
    except Exception as e:
        print("❌ Error loading JSON:", e)
        return []

FULL_PRODUCT_LIST = load_data()

@app.route(f'/api/{DATA_ENDPOINT_NAME}', methods=['GET'])
def get_all_products():
    if not FULL_PRODUCT_LIST:
        return jsonify({"message": "Data is unavailable"}), 500
    return jsonify(FULL_PRODUCT_LIST)

@app.route(f'/api/{DATA_ENDPOINT_NAME}/<product_id>', methods=['GET'])
def get_single_product(product_id):
    for product in FULL_PRODUCT_LIST:
        if str(product.get('id')) == str(product_id):
            return jsonify(product)
    return jsonify({"error": f"Product with ID {product_id} not found"}), 404

@app.route(f'/api/{DATA_ENDPOINT_NAME}/search', methods=['GET'])
def search_products():
    query = request.args.get('name', '').lower()
    results = [
        p for p in FULL_PRODUCT_LIST
        if query in p.get('name', '').lower()
    ]
    return jsonify(results)

@app.route('/api/nearby-pharmacies', methods=['GET'])
def nearby_pharmacies():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    if not lat or not lng:
        return jsonify({"error": "Missing coordinates"}), 400

    radius = 5000  
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    node(around:{radius},{lat},{lng})[amenity=pharmacy];
    out;
    """
    response = requests.get(overpass_url, params={"data": query})
    data = response.json()

    nearby_pharmacies = []
    for node in data.get("elements", []):
        pharmacy_name = node.get("tags", {}).get("name", "Unnamed Pharmacy")
        pharmacy_lat = node.get("lat")
        pharmacy_lng = node.get("lon")

        assigned_products = random.sample(MASTER_PRODUCTS, min(20, len(MASTER_PRODUCTS)))
        products_for_api = [
            {
                "id": p["id"],
                "product_name": p["product_name"],
                "price": p["price"],
                "category": p["category"],
                "product_image": p["product_image"],
                "availability": p["availability"]
            }
            for p in assigned_products
        ]

        nearby_pharmacies.append({
            "name": pharmacy_name,
            "lat": pharmacy_lat,
            "lng": pharmacy_lng,
            "products": products_for_api
        })

    return jsonify(nearby_pharmacies)

if __name__ == '__main__':
    app.run(debug=True)
