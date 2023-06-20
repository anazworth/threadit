import os
import pika

def send_post_to_queue(post):
    # Needs to be a bytes object for rabbitmq
    post_to_bytes = post.json().encode('utf-8')

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(os.getenv('QUEUE_HOST')))
    channel = connection.channel()
    channel.exchange_declare(exchange=os.getenv('QUEUE_NAME'), exchange_type='fanout')
    channel.queue_declare(queue="posts")
    channel.queue_declare(queue="feed")
    channel.queue_bind(exchange=os.getenv('QUEUE_NAME'), queue="posts")
    channel.queue_bind(exchange=os.getenv('QUEUE_NAME'), queue="feed")
    channel.basic_publish(exchange=os.getenv('QUEUE_NAME'), routing_key='', body=post_to_bytes)
    connection.close()
