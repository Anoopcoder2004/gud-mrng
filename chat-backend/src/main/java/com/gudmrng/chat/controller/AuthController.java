package com.gudmrng.chat.controller;

import com.gudmrng.chat.dto.LoginRequest;
import com.gudmrng.chat.dto.LoginResponse;
import com.gudmrng.chat.dto.RegisterRequest;
import com.gudmrng.chat.dto.RegisterResponse;
import com.gudmrng.chat.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}