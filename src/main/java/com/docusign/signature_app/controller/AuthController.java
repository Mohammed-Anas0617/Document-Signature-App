package com.docusign.signature_app.controller;

import com.docusign.signature_app.model.User;
import com.docusign.signature_app.repository.UserRepository;
import com.docusign.signature_app.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User found = userRepository.findByEmail(user.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(user.getPassword(), found.getPassword())) {
            return jwtUtil.generateToken(found.getEmail());
        }
        return "Invalid credentials";
    }
}
