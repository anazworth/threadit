package controllers

import (
	"context"
	"encoding/json"
	"log"
	"read_post_api/config"
	"read_post_api/models"
	"strconv"
	"time"

	// "read_post_api/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func GetPostByID(c *fiber.Ctx) error {
	id := c.Params("id")

	// Check if post exists in Redis
	postToReturn, miss := config.GetPostFromCache(id)
	if miss != nil {

		idInt, err := strconv.Atoi(id)

		if err != nil {
			log.Println(err)
		}

		postCollection := config.MI.DB.Collection("posts")

		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

		filter := bson.M{"post_id": idInt}

		foundPost := postCollection.FindOne(ctx, filter)

		postToReturn := models.Post{}

		err = foundPost.Decode(&postToReturn)
		if err != nil {
			log.Println(err)
		}

		// Set post in Redis
		config.AddPostToCache(postToReturn)

		log.Println("Post not found in cache, added to cache")

		return c.JSON(postToReturn)
	}

	log.Println("Post found in cache")
	return c.JSON(postToReturn)
}

func CreatePost(c *fiber.Ctx) error {
	postCollection := config.MI.DB.Collection("posts")

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	post := new(models.Post)

	if err := c.BodyParser(post); err != nil {
		log.Println(err)
		return c.Status(500).SendString(err.Error())
	}

	postCollection.InsertOne(ctx, post)

	return c.JSON(post)
}

func SavePostFromQueue(body []byte) {
	postCollection := config.MI.DB.Collection("posts")

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	// convert body to string
	bodyString := string(body)

	// convert string to json

	var post models.Post
	err := json.Unmarshal([]byte(bodyString), &post)
	if err != nil {
		log.Println(err)
	}

	postCollection.InsertOne(ctx, post)
}
