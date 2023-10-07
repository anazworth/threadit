package com.threadit.AuthService.User;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;


    @Test
    void UserService_saveNewUser_returnsErrorIfNameTaken() {
        User user = new User("username", "password");
        when(userRepository.findByUsername(Mockito.anyString())).thenReturn(java.util.Optional.of(user));
        Assertions.assertThrows(RuntimeException.class, () -> {
            userService.saveNewUser(user);
        });
    }

    @Test
    void UserService_verifyUser_returnsErrorIfNameNotFound() {
        User user = new User("username", "password");
        when(userRepository.findByUsername(Mockito.anyString())).thenReturn(java.util.Optional.empty());
        Assertions.assertThrows(RuntimeException.class, () -> {
            userService.verifyUser(user);
        });
    }

    @Test
    void UserService_verifyUser_returnsErrorIfPasswordIncorrect() {
        User user = new User("username", "password");
        User user2 = new User("username", "password2");
        when(userRepository.findByUsername(Mockito.anyString())).thenReturn(java.util.Optional.of(user2));
        Assertions.assertThrows(RuntimeException.class, () -> {
            userService.verifyUser(user);
        });
    }

}