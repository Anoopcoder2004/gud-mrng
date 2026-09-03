package com.gudmrng.chat.dto;

public class TypingStatus {

    private Long senderId;
    private String senderUsername;
    private boolean isTyping;

    public TypingStatus(
            Long senderId,
            String senderUsername,
            boolean isTyping) {

        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.isTyping = isTyping;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public boolean isTyping() {
        return isTyping;
    }
}