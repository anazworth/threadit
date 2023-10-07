package com.threadit.AuthService.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO saveNewUser(User user) {
        // Check if the username is already taken
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // Hash the password using BCrypt
        byte[] result = passwordEncoder.encode(user.getPassword()).getBytes();

        user.setPassword(new String(result));

        return new UserDTO(userRepository.save(user).getUsername());
    }

    public UserDTO verifyUser(User user) {

        // Check if the username exists
        if (!userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username does not exist");
        }

        // Check if the password is correct
        User user2 = userRepository.findByUsername(user.getUsername()).get();

        if (!passwordEncoder.matches(user.getPassword(), user2.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        return new UserDTO(userRepository.findByUsername(user.getUsername()).get().getUsername());
    }

    public UserDTO findUserById(Long id) {
        return new UserDTO(userRepository.findById(id).get().getUsername());
    }
}
