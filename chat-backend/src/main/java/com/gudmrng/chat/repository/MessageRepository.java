package com.gudmrng.chat.repository;

import com.gudmrng.chat.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Messages, Long> {

    @Query("""
        SELECT m FROM Messages m
        WHERE (m.sender.id = :userId AND m.receiver.id = :otherUserId)
           OR (m.sender.id = :otherUserId AND m.receiver.id = :userId)
        ORDER BY m.createdAt ASC
    """)
    List<Messages> findConversation(
            @Param("userId") Long userId,
            @Param("otherUserId") Long otherUserId
    );
}
// test