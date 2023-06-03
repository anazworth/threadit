package config

import (
	"encoding/json"
	"log"
	"os"
	"read_post_api/models"
	"strconv"

	"github.com/go-redis/redis"
	"github.com/joho/godotenv"
)

type RedisInstance struct {
	Client *redis.Client
}

var RI RedisInstance

func ConnectRedis() {
	if os.Getenv("APP_ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	RI = RedisInstance{
		Client: redis.NewClient(&redis.Options{
			Addr:     os.Getenv("REDIS_URI"),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       0,
		}),
	}

	_, err := RI.Client.Ping().Result()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Redis connected!")
}

func GetPostFromCache(id string) (models.Post, error) {
	var post models.Post

	val, err := RI.Client.Get(id).Result()
	if err != nil {
		return post, err
	}

	err = json.Unmarshal([]byte(val), &post)
	if err != nil {
		return post, err
	}

	return post, nil
}

func AddPostToCache(post models.Post) error {
	postJSON, err := json.Marshal(post)
	if err != nil {
		return err
	}

	err = RI.Client.Set(strconv.Itoa(post.PostID), postJSON, 0).Err()
	if err != nil {
		return err
	}

	return nil
}
