package com.feedapi

import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.*

@RabbitListener
class PostListener(private val postService: PostService) {

    @Queue("feed")
    fun receivePost(post: PostDTO) {
        println("Received post: $post")
        // Convert PostDTO to Post

        val postToSave = Post(
            post.post_id,
            post.user,
            post.topic,
            post.title,
            post.content,
            post.created
        )
        // Save post
        postService.save(postToSave)
    }
}