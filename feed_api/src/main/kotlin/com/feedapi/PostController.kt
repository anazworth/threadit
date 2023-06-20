package com.feedapi

import io.micronaut.http.annotation.*
import io.micronaut.http.annotation.Post

@Controller("/api/v1/feed")
class PostController(private val postRepository: PostRepository, private val postService: PostService) {

    @Get("/")
    fun index(): String {
        return "Hello World"
    }

    @Post("/")
    fun create(@Body post: com.feedapi.Post): com.feedapi.Post {
        return postService.save(post)
    }

    // Get all posts ordered by created date descending by page
    @Get("/new")
    fun listPostByNew(@QueryValue(defaultValue = "0") page: Int): List<com.feedapi.Post> {
        return postService.listPostByNew(page)
    }

    // Get all posts by topic ordered by created date descending
    @Get("/new/{topic}")
    fun listByTopic(@PathVariable topic: String, @QueryValue(defaultValue = "0") page: Int): List<com.feedapi.Post> {
        return postService.listByTopicAndNew(topic, page)
    }
}
