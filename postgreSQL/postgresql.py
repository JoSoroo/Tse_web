import json
import psycopg2
import sys
sys.stdout.reconfigure(encoding='utf-8')
DATABASE_CONFIG = {
    "dbname": "tse_db",
    "user": "postgres",
    "password": "Soroo0601",
    "host": "localhost",
    "port": "5432"
}

# JSON файлын зам
json_file_path = "C:\\Exports\\your_data.json"

# PostgreSQL хүснэгт үүсгэх SQL
CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS products (
    _id SERIAL PRIMARY KEY,
    name TEXT,
    price NUMERIC,
    category TEXT
);
"""

# JSON өгөгдлийг PostgreSQL-д оруулах SQL
INSERT_SQL = """
INSERT INTO products (name, price, category)
VALUES (%s, %s, %s)
ON CONFLICT (_id) DO NOTHING;
"""

try:
    # PostgreSQL-д холбогдох
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cursor = conn.cursor()

    # Хүснэгт үүсгэх
    cursor.execute(CREATE_TABLE_SQL)
    print("Products хүснэгт амжилттай үүсгэгдлээ эсвэл аль хэдийн байгаа.")

    # JSON файлыг унших
    with open(json_file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    # Өгөгдлийг PostgreSQL-д оруулах
    for record in data:
        cursor.execute(INSERT_SQL, (record.get("title"), record.get("price"), record.get("category")))

    conn.commit()
    print("JSON өгөгдөл амжилттай PostgreSQL-д импортлогдлоо!")

except (Exception, psycopg2.Error) as error:
    print("Алдаа гарлаа:", error)

finally:
    # Холболтыг хаах
    if cursor:
        cursor.close()
    if conn:
        conn.close()
    print("PostgreSQL холболт хаагдлаа.")
