import datetime
import os
import mysql.connector
from typing import Optional
from fastapi import Cookie, FastAPI, HTTPException, Request
from pydantic import BaseModel
from jose import jwt

from post_db import create_table_if_not_exists, get_posts_db, save_post
from post_queue import send_post_to_queue

jwt_secret = "thisismydogcurryssecretkeywhydoesitneedtobesolong"

class Post(BaseModel):
    post_id: Optional[str] = None
    user: str
    topic: str
    title: str
    content: str
    created: Optional[str] = None

create_table_if_not_exists()
app = FastAPI()

@app.get("/api/v1/write/health")
async def root():
    return {"message": "OK"}

@app.get("/api/v1/write/posts")
async def get_posts():
    return get_posts_db()

@app.post("/api/v1/write/post")
async def write_post(post: Post, request: Request):

    userJWT = request.cookies.get('jwtCookie') or request.headers.get('jwtCookie')
    

    # Check if token is valid
    if userJWT is None:
        raise HTTPException(status_code=401, detail="No JWT provided")
    
    try:
        token_info = jwt.decode(userJWT, jwt_secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="JWT expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid JWT")

    # Check if user is valid
    if token_info['sub'] != post.user:
        return {"error": "Invalid user"} 
    
    # Check if token is expired
    if token_info['exp'] < datetime.datetime.now().timestamp():
        return {"error": "Token expired"}

    # Add Unix timestamp
    post.created = str(datetime.datetime.now().timestamp())

    # Add post to database
    try:
       post.post_id = save_post(post)
    except mysql.connector.Error as err:
        return {"error": err}
    
    # @TODO
    # Add event to rabbitmq
    str(post.post_id)
    send_post_to_queue(post)

    return post