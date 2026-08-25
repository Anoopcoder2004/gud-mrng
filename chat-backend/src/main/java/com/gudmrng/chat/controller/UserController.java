package com.gudmrng.chat.controller;

import com.gudmrng.chat.dto.UserResponse;
import com.gudmrng.chat.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Page<UserResponse> getUsers(
            Pageable pageable,
            Authentication authentication) {

        String email = authentication.getName();

        return userService.getUsers(email, pageable);
    }
}