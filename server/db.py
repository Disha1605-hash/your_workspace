import pymysql

def get_connection():
    return pymysql.connect(
        host="bdkhottcwh8m9x33k5u5-mysql.services.clever-cloud.com",
        user="ua3lg4aaeojwygke",
        password="NZY3XliGPSbgwErONdXg",  
        database="bdkhottcwh8m9x33k5u5",
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )
