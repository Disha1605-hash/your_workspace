from flask import Blueprint, request, jsonify
from db import get_connection
import hashlib
import pymysql

users = Blueprint('users', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@users.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data received'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    hashed_pw = hash_password(password)

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s OR username = %s", (email, username))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'success': False, 'error': 'User already exists'}), 409

        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_pw)
        )
        conn.commit()
        user_id = cursor.lastrowid

        return jsonify({'success': True, 'message': 'User registered', 'user_id': user_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@users.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Force parse JSON
        data = request.get_json(force=True)
        print("Login data received:", data)

        if not isinstance(data, dict):
            return jsonify({'error': 'Invalid JSON structure'}), 400

        identifier = data.get('identifier')
        password = data.get('password')

        print("identifier:", identifier)
        print("password:", password)

        if not identifier or not password:
            return jsonify({'error': 'Missing credentials'}), 400

        conn = get_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (identifier, identifier))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        hashed_pw = hashlib.sha256(password.encode()).hexdigest()
        if user['password'] != hashed_pw:
            return jsonify({'error': 'Incorrect password'}), 401

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'profile_image': user.get('profile_image', '')
            }
        }), 200

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@users.route('/delete_account', methods=['POST', 'OPTIONS'])
def delete_account():
    if request.method == 'OPTIONS':
        return '', 200  

    try:
        data = request.get_json(force=True)
        print("🧪 Received payload:", data)

        email = data.get('email')
        print("🔍 Email to delete:", email)

        if not email:
            print("❌ Missing email!")
            return jsonify({'success': False, 'error': 'Email is required'}), 400

        conn = get_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("DELETE FROM users WHERE email = %s", (email,))
        conn.commit()

        if cursor.rowcount == 0:
            print("❌ No user found with email:", email)
            return jsonify({'success': False, 'error': 'User not found'}), 404

        print("✅ Deleted user with email:", email)
        return jsonify({'success': True, 'message': 'Account deleted'}), 200

    except Exception as e:
        print("🔥 Delete Account Error:", str(e)) 
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception as close_err:
            print("⚠️ Error closing DB:", close_err)




