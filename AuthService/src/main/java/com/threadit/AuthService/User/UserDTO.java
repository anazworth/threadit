package com.threadit.AuthService.User;

public record UserDTO(String username) {

    public String getUsername() {
        return username;
    }
}