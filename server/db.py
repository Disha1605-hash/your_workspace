import pymysql

def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Direction@123",
        database="your_workspace",
        cursorclass=pymysql.cursors.DictCursor
    )
