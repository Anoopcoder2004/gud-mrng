package com.gudmrng.chat.controller;

import com.gudmrng.chat.dto.SendMessageRequest;
import com.gudmrng.chat.entity.Messages;
import com.gudmrng.chat.service.MessageService;
import com.gudmrng.chat.dto.MessageResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
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
}