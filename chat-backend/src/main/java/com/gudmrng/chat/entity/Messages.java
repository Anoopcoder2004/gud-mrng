package com.gudmrng.chat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Messages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CHANGED: User is another @Entity, so use a JPA relationship
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // CHANGED: User is another @Entity, so use a JPA relationship
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Messages() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // CHANGED: getter for sender
    public User getSender() {
        return sender;
    }

    // CHANGED: setter for sender
    public void setSender(User sender) {
        this.sender = sender;
    }

    // CHANGED: getter for receiver
    public User getReceiver() {
        return receiver;
    }

    // CHANGED: setter for receiver
    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    // CHANGED: getter for content
    public String getContent() {
        return content;
    }

    // CHANGED: setter for content
    public void setContent(String content) {
        this.content = content;
    }

    // CHANGED: getter for createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // CHANGED: setter for createdAt
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}