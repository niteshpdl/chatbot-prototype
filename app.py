from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from database import products_database

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key='AIzaSyDvsftvRZvWP823kXmkjdKJxHmQbIZdJoo')
model = genai.GenerativeModel('gemini-pro')

def search_product(query):
    keywords = ["iphone", "kindle", "airpods", "buy", "price", "show", "purchase", "get", "find", "apple"]
    query = query.lower()
    
    print("Searching for:", query)
    
    # First check for exact product matches
    if "kindle" in query:
        return products_database["kindle"]
    elif "airpods" in query:
        return products_database["airpods"]
    elif "iphone" in query:
        return products_database["iphone"]
        
    return None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def chatbot_response():
    msg = request.get_json()
    if msg and 'message' in msg:
        user_message = msg['message'].lower()
        print("User asked:", user_message)  # Debug print
        
        # Check for product query
        product = search_product(user_message)
        if product:
            print("Found product:", product)  # Debug print
            response = f"Here's what you're looking for: <a href='{product['url']}' target='_blank'>{product['name']}</a> - {product['price']}<br>Description: {product['description']}"
            return jsonify({"answer": response})
        
        # If not a product query, use Gemini AI
        response = model.generate_content(msg['message'])
        return jsonify({"answer": response.text})
        
    return jsonify({"answer": "Welcome! I can help you find books or answer any questions. Just ask!"})

if __name__ == "__main__":
    app.run(debug=True)
