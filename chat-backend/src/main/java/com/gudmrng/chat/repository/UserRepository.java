package com.gudmrng.chat.repository;

import com.gudmrng.chat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    // Conceptually:
    // SELECT *
    // FROM users
    // WHERE email = ?;
}