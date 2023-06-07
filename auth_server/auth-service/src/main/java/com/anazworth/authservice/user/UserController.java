package com.anazworth.authservice.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anazworth.authservice.jwt.JwtUtils;

@RestController
@RequestMapping("/api/v1")
@ComponentScan("com.anazworth.authservice")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    JwtUtils JwtUtils;

    @PostMapping("/users")
    public User createUser(
            @RequestParam(value = "username") String username,
            @RequestParam(value = "password") String password) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(bCryptPasswordEncoder.encode(password));
        return userRepository.save(newUser);
    }

    @GetMapping("/users")
    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/users/login")
    public ResponseEntity<?> login(@RequestBody User requser) {
        String username = requser.getUsername();
        String password = requser.getPassword();
        User user = userRepository.findByUsername(username).get(0);
        if (bCryptPasswordEncoder.matches(password, user.getPassword())) {
            ResponseCookie jwtCookie = JwtUtils.generateJwtCookie(user);
            String jwt = JwtUtils.generateToken(user.getUsername());

            UserJWT response = new UserJWT();
            response.setUsername(user.getUsername());
            response.setJwt(jwt);

            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE, jwt)
                    .body(response);
        }
        return ResponseEntity
                .badRequest()
                .body("Invalid username or password");
    }

    @PostMapping("/users/check")
    public ResponseEntity<?> check(@CookieValue(value = "jwtCookie", defaultValue = "") String jwtCookie) {
        String usernameFromToken = JwtUtils.getUserNameFromJwtToken(jwtCookie);
        User user = userRepository.findByUsername(usernameFromToken).get(0);
        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Please login");
        }

        if (JwtUtils.validateJwtToken(jwtCookie)) {
            return ResponseEntity
                    .ok()
                    .body("User: " + user.getUsername() + " is logged in");
        }

        return ResponseEntity
                .badRequest()
                .body("Invalid token");
    }

    @GetMapping("/users/createFake")
    public User createFakeUser() {
        User newUser = new User();
        newUser.setUsername("fake");
        newUser.setPassword("fake");
        return userRepository.save(newUser);
    }

    @GetMapping("/users/deleteAll")
    public void deleteAllUsers() {
        userRepository.deleteAll();
    }
}
