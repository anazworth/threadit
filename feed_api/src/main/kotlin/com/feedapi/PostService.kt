package com.feedapi

import jakarta.inject.Singleton

@Singleton
class PostService(private val postRepository: PostRepository) {

    fun save(post: Post): Post {
        // Shorten the content to 100 characters
        if (post.content.length > 100)
        post.content = post.content.slice(0..100)
        return postRepository.save(post)
    }


    fun listPostByNew(page: Int): List<Post> {
        return postRepository.findAllOrderByCreatedDesc(io.micronaut.data.model.Pageable.from(page, 10))
    }

    fun listByTopicAndNew(topic: String, page: Int): List<Post> {
        return postRepository.findByTopicOrderByCreatedDesc(topic, io.micronaut.data.model.Pageable.from(page, 10))
    }
}