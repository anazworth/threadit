package com.feedapi

import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.Pageable
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.PageableRepository
import javax.validation.constraints.NotBlank

@JdbcRepository(dialect = Dialect.MYSQL)
interface PostRepository : PageableRepository<Post, Int> {

    abstract fun save(@NotBlank post: Post): Post;

    fun findByTopicOrderByCreatedDesc(topic: String, pageable: Pageable): List<Post>;



    // get all posts ordered by created date descending by page
    fun findAllOrderByCreatedDesc(pageable: Pageable): List<Post>
}