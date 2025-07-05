from flask import Blueprint, request, jsonify
from db import get_connection
import pymysql
import hashlib

users = Blueprint('users', __name__)

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

        # Get the user's ID from the email
        cursor.execute("SELECT id FROM users WHERE LOWER(email) = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        user_id = user['id']

        # Delete associated quotes
        cursor.execute("DELETE FROM quotes WHERE user_id = %s", (user_id,))

        # Delete the user
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
