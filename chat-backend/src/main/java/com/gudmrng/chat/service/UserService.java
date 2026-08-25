package com.gudmrng.chat.service;

import com.gudmrng.chat.dto.UserResponse;
import com.gudmrng.chat.entity.User;
import com.gudmrng.chat.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Page<UserResponse> getUsers(
            String email,
            Pageable pageable) {

        // Find logged-in user
        User loggedInUser = userRepository.findByEmail(email);

        // Find everyone except logged-in user
        Page<User> users =
                userRepository.findByIdNot(
                        loggedInUser.getId(),
                        pageable
                );

        // Convert User → UserResponse
        return users.map(user ->
                new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail()
                )
        );
    }
}