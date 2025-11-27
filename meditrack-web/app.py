import json
from flask import Flask, jsonify, request
from flask_cors import CORS

JSON_FILENAME = 'src/data/api-dataset.json'
DATA_ENDPOINT_NAME = 'products'

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
