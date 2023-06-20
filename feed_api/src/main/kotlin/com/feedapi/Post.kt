package com.feedapi

import io.micronaut.data.annotation.EmbeddedId
import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.serde.annotation.Serdeable

@Serdeable
@MappedEntity
data class Post(
    @field:Id
    var postId: Int,
    var user: String,
    var topic: String,
    var title: String,
    var content: String,
    var created: String,
)
