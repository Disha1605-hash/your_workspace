from flask import Blueprint, request, jsonify
from db import get_connection
import pymysql

quote_bp = Blueprint('quote_bp', __name__)

@quote_bp.route('/quote', methods=['GET'])
def get_random_quote():
    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        cursor.execute("""
            SELECT q.quote, u.username
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            ORDER BY RAND()
            LIMIT 1
        """)
        result = cursor.fetchone()

        if result:
            return jsonify({
                'quote': result['quote'],
                'username': result['username']
            }), 200
        else:
            return jsonify({
                'quote': 'Stay focused and productive!',
                'username': 'Anonymous'
            }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@quote_bp.route('/quote', methods=['POST'])
def submit_quote():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data received'}), 400

    user_id = data.get('user_id')
    quote_text = data.get('quote', '').strip()

    if not user_id:
        return jsonify({'success': False, 'error': 'User ID is missing'}), 400

    if not quote_text:
        return jsonify({'success': True, 'message': 'Quote skipped'}), 200

    conn = get_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        cursor.execute(
            "INSERT INTO quotes (user_id, quote) VALUES (%s, %s)",
            (user_id, quote_text)
        )
        conn.commit()
        return jsonify({'success': True, 'message': 'Quote saved'}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()
