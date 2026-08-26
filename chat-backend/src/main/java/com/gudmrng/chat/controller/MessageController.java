package com.gudmrng.chat.controller;

import com.gudmrng.chat.dto.SendMessageRequest;
import com.gudmrng.chat.service.MessageService;
import com.gudmrng.chat.dto.MessageResponse;
import com.gudmrng.chat.entity.User;
import com.gudmrng.chat.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    public MessageController(
            MessageService messageService,
            UserRepository userRepository) {

        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public MessageResponse sendMessage(
            @RequestBody SendMessageRequest request,
            Authentication authentication) {

        String senderEmail = authentication.getName();

        return messageService.sendMessage(
                request.getReceiverId(),
                request.getContent(),
                senderEmail
        );
    }

    @GetMapping("/{otherUserId}")
    public List<MessageResponse> getConversation(
            @PathVariable Long otherUserId,
            Authentication authentication) {

        // Get email from JWT
        String senderEmail = authentication.getName();

        // Find logged-in user
        User user = userRepository.findByEmail(senderEmail);

        // Get conversation using IDs
        return messageService.getConversation(
                user.getId(),
                otherUserId
        );
    }
}