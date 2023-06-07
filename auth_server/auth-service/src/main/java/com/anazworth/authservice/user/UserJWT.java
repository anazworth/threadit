package com.anazworth.authservice.user;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
public class UserJWT {

    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    private String jwt;
}
