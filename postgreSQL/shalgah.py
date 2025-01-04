import psycopg2
import sys
sys.stdout.reconfigure(encoding='utf-8')
# PostgreSQL өгөгдлийн сантай холбогдох тохиргоо
DATABASE_CONFIG = {
    "dbname": "tse_db",
    "user": "postgres",
    "password": "Soroo0601",
    "host": "localhost",
    "port": "5432"
}

try:
    # PostgreSQL-д холбогдох
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cursor = conn.cursor()

    # Өгөгдлийг шалгах
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()

    # Өгөгдлийг хэвлэх
    for row in rows:
        print(row)

except (Exception, psycopg2.Error) as error:
    print("Алдаа гарлаа:", error)

finally:
    # Холболтыг хаах
    if cursor:
        cursor.close()
    if conn:
        conn.close()
