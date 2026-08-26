package com.gudmrng.chat.controller;

import com.gudmrng.chat.dto.ChatMessage;
import com.gudmrng.chat.dto.MessageResponse;
import com.gudmrng.chat.entity.User;
import com.gudmrng.chat.service.MessageService;
import com.gudmrng.chat.repository.UserRepository;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public ChatWebSocketController(
            MessageService messageService,
            SimpMessagingTemplate messagingTemplate,
            UserRepository userRepository) {

        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat")
    public void sendMessage(
            ChatMessage message,
            Principal principal) {

        System.out.println(
                "CONTROLLER PRINCIPAL = " + principal
        );

        if (principal == null) {
            throw new IllegalStateException(
                    "WebSocket user is not authenticated"
            );
        }

        String senderEmail = principal.getName();

        System.out.println(
                "Message sender = " + senderEmail
        );

        MessageResponse savedMessage =
                messageService.sendMessage(
                        message.getReceiverId(),
                        message.getContent(),
                        senderEmail
                );

        // 🔥 CHANGED
        // Find receiver's email because Spring's
        // /user destination works with Principal name.
        User receiver =
                userRepository.findById(
                        savedMessage.getReceiverId()
                ).orElseThrow();

        String receiverEmail =
                receiver.getEmail();

        System.out.println(
                "Sending to receiver = " + receiverEmail
        );

        // 🔥 CHANGED
        // Send to receiver's authenticated Principal
        messagingTemplate.convertAndSendToUser(
                receiverEmail,
                "/queue/messages",
                savedMessage
        );

        // 🔥 CHANGED
        // Send to sender's authenticated Principal
        messagingTemplate.convertAndSendToUser(
                senderEmail,
                "/queue/messages",
                savedMessage
        );
    }
}