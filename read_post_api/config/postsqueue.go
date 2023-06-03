package config

import (
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
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
