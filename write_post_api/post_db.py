import os
import mysql.connector

posts_db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)

def get_posts_db():
    cursor = posts_db.cursor()
    cursor.execute("SELECT * FROM posts")
    return cursor.fetchall()

def save_post(post):
    cursor = posts_db.cursor()
    sql = "INSERT INTO posts (user, topic, title, content, created) VALUES (%s, %s, %s, %s, %s)"
    val = (post.user, post.topic, post.title, post.content[:200], post.created)
    cursor.execute(sql, val)
    posts_db.commit()
    return cursor.lastrowid

def create_table_if_not_exists():
    cursor = posts_db.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS posts (post_id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(255), topic VARCHAR(255), title VARCHAR(255), content VARCHAR(255), created VARCHAR(255))")