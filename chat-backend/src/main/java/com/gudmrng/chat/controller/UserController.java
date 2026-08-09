package com.gudmrng.chat.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/api/users")
    public String getUsers(Authentication authentication) {

        return "Authenticated user: " + authentication.getName();
    }
}