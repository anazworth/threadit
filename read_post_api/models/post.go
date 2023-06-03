package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Post struct {
	ID      primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	PostID  int                `json:"post_id,omitempty" bson:"post_id,omitempty"`
	User    string             `json:"user,omitempty" bson:"user,omitempty"`
	Topic   string             `json:"topic,omitempty" bson:"topic,omitempty"`
	Title   string             `json:"title,omitempty" bson:"title,omitempty"`
	Content string             `json:"content,omitempty" bson:"content,omitempty"`
	Created string             `json:"created,omitempty" bson:"created,omitempty"`
}
