package com.feedapi

import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.serde.annotation.Serdeable

@Serdeable
data class PostDTO(
    var post_id: Int,
    var user: String,
    var topic: String,
    var title: String,
    var content: String,
    var created: String,
)
