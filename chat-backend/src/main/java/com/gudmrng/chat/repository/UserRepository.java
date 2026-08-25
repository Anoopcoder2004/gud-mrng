package com.gudmrng.chat.repository;

import com.gudmrng.chat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    // Conceptually:
    // SELECT *
    // FROM users
    // WHERE email = ?;
        Page<User> findByIdNot(Long userId, Pageable pageable);

}