package main

import (
	// "log"
	"log"
	"read_post_api/config"
	"read_post_api/controllers"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// MongoDB connection
	config.ConnectDB()

	// Redis connection
	config.ConnectRedis()

	// RabbitMQ connection
	config.ConnectRabbitMQ()

	msgs, err := config.RMQ.Ch.Consume(
		"posts",
		"",
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Default()
	}

	go func() {
		for msg := range msgs {
			log.Println("New post received")
			// save post to mongodb
			controllers.SavePostFromQueue(msg.Body)
		}
	}()

	// Routes
	app.Get("/api/v1/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
		})
	})

	app.Get("/api/v1/read/:id", controllers.GetPostByID)

	app.Post("/api/v1/read/create", controllers.CreatePost)

	app.Listen(":8081")
}
