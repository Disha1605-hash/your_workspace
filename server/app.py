import os
import hashlib
import pymysql
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from users import users
from quotes import quote_bp  # 👈 include blueprint

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://yourworkspace.vercel.app"}}, supports_credentials=True)

# Register quote blueprint
app.register_blueprint(quote_bp)

# Upload folder config
UPLOAD_FOLDER = 'uploads/profile_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database connection
def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Direction@123",
        database="your_workspace",
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

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data received'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s OR username = %s", (email, username))
        existing_user = cursor.fetchone()
        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'error': 'User already exists'}), 409

        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_pw)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'User registered', 'user_id': user_id}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data received'}), 400

    identifier = data.get('username')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'Missing credentials'}), 400

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (identifier, identifier))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'User not found'}), 404

        if user['password'] != hashed_pw:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Incorrect password'}), 401

        cursor.close()
        conn.close()
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

