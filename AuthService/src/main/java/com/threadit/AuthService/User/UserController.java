package com.threadit.AuthService.User;

import com.threadit.AuthService.UserSession.UserSession;
import com.threadit.AuthService.UserSession.UserSessionRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;


    private final UserSessionRepository userSessionRepository;


    public UserController(UserService userService, UserSessionRepository userSessionRepository) {
        this.userService = userService;
        this.userSessionRepository = userSessionRepository;
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createNewUser(@RequestBody User user) {
        return userService.saveNewUser(user);
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userService.findUserById(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpServletResponse response, HttpSession session) {
        // Verify the user
        UserDTO userDTO = userService.verifyUser(user);

        // Create a new session
        session.setAttribute("user", userDTO);

        // Create a new cookie
        Cookie cookie = new Cookie("JSESSIONID", session.getId());

        // Set the cookie to expire in 1 hour
        cookie.setMaxAge(60 * 60);
        session.setMaxInactiveInterval(60 * 60);

        // Save the session to redis
        UserSession userSession = new UserSession();
        userSession.setId(session.getId());
        userSession.setUsername(userDTO.getUsername());

        userSessionRepository.save(userSession);

        // Return the user
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(HttpSession session) {
        try {
            UserSession userSession = userSessionRepository.findById(session.getId())
                    .orElseThrow(() -> new Exception("Session not found"));

            Object user = session.getAttribute("user");
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found in the session");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        // Get the session id from the bearer token
        String sessionId = Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals("JSESSIONID"))
                .findFirst()
                .get()
                .getValue();

        // Delete the session
        userSessionRepository.deleteById(sessionId);

        // Invalidate the session
        request.getSession().invalidate();

        // Delete the cookie
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("success");
    }

    @GetMapping("/sessions/{username}")
    public Optional<ArrayList<UserSession>> getAllSessionsByUsername(@PathVariable String username) {
        return userSessionRepository.findAllByUsername(username);
    }
    @DeleteMapping("/sessions/{sessionID}")
    public void deleteSession(@PathVariable String sessionID) {
        userSessionRepository.deleteById(sessionID);
    }

}
