from flask import Blueprint, request, jsonify
from db import get_connection
import hashlib
import pymysql

users = Blueprint('users', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ----------------- Register ------------------
@users.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data received'}), 400

    username = data.get('username')
    email = data.get('email', '').strip().lower()
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

# ----------------- Login ------------------
@users.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json(force=True)
        identifier = data.get('identifier')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'error': 'Missing credentials'}), 400

        conn = get_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (identifier, identifier))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        hashed_pw = hash_password(password)
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
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

# ----------------- Delete Account (User + Quotes) ------------------
@users.route('/delete_account', methods=['POST', 'OPTIONS'])
def delete_account():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json(force=True)
        email = data.get('email', '').strip().lower()

        if not email:
            return jsonify({'success': False, 'error': 'Email is required'}), 400

        conn = get_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Find the user's ID
        cursor.execute("SELECT id FROM users WHERE LOWER(email) = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        user_id = user['id']

        # Delete user's quotes first
        cursor.execute("DELETE FROM quotes WHERE user_id = %s", (user_id,))

        # Then delete user
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()

        return jsonify({'success': True, 'message': 'Account and related quotes deleted'}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': f'Deletion failed: {str(e)}'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
