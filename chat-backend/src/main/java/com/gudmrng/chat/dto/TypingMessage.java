package com.gudmrng.chat.dto;

public class TypingMessage {

    private Long receiverId;
    private boolean isTyping;

    public TypingMessage() {
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public boolean isTyping() {
        return isTyping;
    }

   public void setIsTyping(boolean isTyping) {

    System.out.println(
        "🔥 setIsTyping received = " + isTyping
    );

    this.isTyping = isTyping;

    System.out.println(
        "🔥 field after assignment = " + this.isTyping
    );
}
}
