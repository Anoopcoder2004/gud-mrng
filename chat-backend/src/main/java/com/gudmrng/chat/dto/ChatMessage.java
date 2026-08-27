package com.gudmrng.chat.dto;

public class ChatMessage {

    private Long receiverId;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(Long receiverId, String content) {
        this.receiverId = receiverId;
        this.content = content;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}