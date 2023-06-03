import os
import pika

def send_post_to_queue(post):
    # Needs to be a bytes object for rabbitmq
    post_to_bytes = post.json().encode('utf-8')

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(os.getenv('QUEUE_HOST')))
    channel = connection.channel()
    channel.queue_declare(queue=os.getenv('QUEUE_NAME'))
    channel.basic_publish(exchange='', routing_key=os.getenv('QUEUE_NAME'), body=post_to_bytes)
    connection.close()
