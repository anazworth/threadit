package com.threadit.AuthService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;


@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@EnableRedisRepositories
public class AuthServiceApplication {


    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

}
