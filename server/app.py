import os
import hashlib
import pymysql
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from users import users
from quotes import quote_bp  # 👈 include blueprint

app = Flask(__name__)
CORS(app, origins=["https://yourworkspace-five.vercel.app"], supports_credentials=True)

db_config = {
    "host": "bdkhottcwh8m9x33k5u5-mysql.services.clever-cloud.com",
    "user": "ua3lg4aaeojwygke",
    "password": "NZY3XliGPSbgwErONdXg",
    "database": "bdkhottcwh8m9x33k5u5"
}

# Register quote blueprint
app.register_blueprint(quote_bp)
app.register_blueprint(users) 

# Upload folder config
UPLOAD_FOLDER = 'uploads/profile_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database connection
def get_connection():
    return pymysql.connect(
        host="bdkhottcwh8m9x33k5u5-mysql.services.clever-cloud.com",
        user="ua3lg4aaeojwygke",
        password="NZY3XliGPSbgwErONdXg",
        database="bdkhottcwh8m9x33k5u5",
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )


@app.route('/')
def home():
    return "Backend is running!"

@app.route('/upload-profile-image', methods=['POST'])
def upload_profile_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = file.filename
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    image_url = f'/profile-images/{filename}'
    return jsonify({'image_url': image_url})

@app.route('/profile-images/<filename>')
def serve_profile_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    
@app.route('/get-user-id', methods=['POST', 'OPTIONS'])
def get_user_id():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'success': False, 'error': 'Email is required'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({'success': True, 'user_id': user['id']}), 200
        else:
            return jsonify({'success': False, 'error': 'User not found'}), 404

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://yourworkspace-five.vercel.app')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

