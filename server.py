from flask import Flask, send_from_directory, jsonify
import subprocess
import os
import json

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/api/update')
def api_update():
    print("Received update request, running scraper subprocess...")
    try:
        # Run fetch_bids.py as a separate process
        subprocess.run(["python", "fetch_bids.py"], check=True)
        
        # Read the generated JSON
        if os.path.exists("data.json"):
            with open("data.json", "r", encoding="utf-8") as f:
                items = json.load(f)
            print(f"Scraper finished. Returning {len(items)} items from data.json.")
            return jsonify(items)
        else:
            return jsonify({"error": "Failed to generate data"}), 500
            
    except Exception as e:
        print(f"Error running scraper: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == "__main__":
    print("Starting server on http://localhost:5001") # Use port 5001 for bidsearch to avoid conflict
    
    # Auto-open browser
    import webbrowser
    webbrowser.open("http://localhost:5001")
    
    app.run(port=5001, debug=False)
