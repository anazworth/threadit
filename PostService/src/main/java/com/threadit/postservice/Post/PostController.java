package com.threadit.postservice.Post;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequestMapping("api/v1/post")
public class PostController {

    @PostMapping("")
    public ResponseEntity<?> createPost(@CookieValue(value = "JSESSIONID", required = true) String sessionId) {
        // Make a request to the authentication service to check if the user is logged in
        // If the user is logged in, then create a post

        RestTemplate restTemplate = new RestTemplate();
        String url = "http://10.10.10.14:8000/api/v1/user/verify";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // If the user is not logged in, then return an error
        if (response.getStatusCodeValue() != 200) {
            return ResponseEntity.status(401).body("You are not logged in");
        }

        // If the user is logged in, then create a post
        // Get the user id from the response
        String userId = response.getBody();

        // return username
        return ResponseEntity.ok().body(userId);
    }
}