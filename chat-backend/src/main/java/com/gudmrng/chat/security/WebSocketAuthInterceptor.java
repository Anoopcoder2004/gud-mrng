package com.gudmrng.chat.security;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    public WebSocketAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        // ⭐ CHANGED
        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            System.out.println(
                    "WS AUTH HEADER = " + authHeader
            );

            if (authHeader == null ||
                    !authHeader.startsWith("Bearer ")) {

                throw new IllegalArgumentException(
                        "Missing Authorization header"
                );
            }

            String token =
                    authHeader.substring(7);

            if (!jwtService.isTokenValid(token)) {

                throw new IllegalArgumentException(
                        "Invalid JWT token"
                );
            }

            String email =
                    jwtService.extractEmail(token);

            System.out.println(
                    "WS EMAIL = " + email
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.emptyList()
                    );

            // ⭐ CHANGED
            accessor.setUser(authentication);

            System.out.println(
                    "WS PRINCIPAL AFTER SET = "
                            + accessor.getUser()
            );
        }

        return message;
    }
}