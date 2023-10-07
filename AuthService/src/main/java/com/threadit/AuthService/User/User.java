package com.threadit.AuthService.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@ToString
public class User {
        @Id
        @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
        @Getter
        private Long id;


        @Getter
        @Setter
        private String username;

        @Getter
        @Setter
        private String password;

        public User() {
        }

        public User(String username, String password) {
                this.username = username;
                this.password = password;
        }
}