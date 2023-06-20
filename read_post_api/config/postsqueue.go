package config

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"os"
)

type RabbitMQ struct {
	Conn *amqp.Connection
	Ch   *amqp.Channel
}

var RMQ RabbitMQ

func ConnectRabbitMQ() {
	queueURI := os.Getenv("QUEUE_URI")
	RabbitMQURI := "amqp://guest:guest@" + queueURI + ":5672/"

	conn, err := amqp.Dial(RabbitMQURI)
	if err != nil {
		panic(err)
	}

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}

	err = ch.ExchangeDeclare(
		"posts",
		"fanout",
		false,
		false,
		false,
		false,
		nil,
	)

	// Declare queue
	q, err := ch.QueueDeclare(
		"posts",
		false,
		false,
		false,
		false,
		nil,
	)

	println("Queue name: " + q.Name)

	err = ch.QueueBind(
		"posts",
		"posts",
		"posts",
		false,
		nil,
	)

	RMQ = RabbitMQ{
		Conn: conn,
		Ch:   ch,
	}
}

func (r *RabbitMQ) Close() {

	r.Conn.Close()
	r.Ch.Close()
}

// consumer
func (r *RabbitMQ) Consume(queueName string) (<-chan amqp.Delivery, error) {
	return r.Ch.Consume(
		queueName,
		"posts",
		true,
		false,
		false,
		false,
		nil,
	)
}
