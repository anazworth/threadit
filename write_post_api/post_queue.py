import pika

def send_post_to_queue(post):
    # Needs to be a bytes object for rabbitmq
    post_to_bytes = post.json().encode('utf-8')

    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='posts')
    channel.basic_publish(exchange='', routing_key='posts', body=post_to_bytes)
    connection.close()
