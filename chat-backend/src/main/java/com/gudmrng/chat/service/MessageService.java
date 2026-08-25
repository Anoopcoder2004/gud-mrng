package com.gudmrng.chat.service;

import com.gudmrng.chat.entity.Messages;
import com.gudmrng.chat.entity.User;
import com.gudmrng.chat.repository.MessageRepository;
import com.gudmrng.chat.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.gudmrng.chat.dto.MessageResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository) {

        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public MessageResponse sendMessage(
            Long receiverId,
            String content,
            String senderEmail) {

        User sender = userRepository.findByEmail(senderEmail);

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Messages message = new Messages();

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());

        Messages savedMessage = messageRepository.save(message);

        return new MessageResponse(
            savedMessage.getId(),
            savedMessage.getSender().getId(),
            savedMessage.getReceiver().getId(),
            savedMessage.getContent(),
            savedMessage.getCreatedAt()
        );
    }

    public List<MessageResponse> getConversation(
        Long userId,
        Long otherUserId) {

    List<Messages> messages =
            messageRepository.findConversation(userId, otherUserId);

    return messages.stream()
            .map(message -> new MessageResponse(
                    message.getId(),
                    message.getSender().getId(),
                    message.getReceiver().getId(),
                    message.getContent(),
                    message.getCreatedAt()
            ))
            .toList();
}

}