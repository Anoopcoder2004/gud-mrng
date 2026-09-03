import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage,
  sendTypingStatus
} from "../services/websocket";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

interface TypingStatus {
  senderId: number;
  senderUsername: string;
  typing: boolean;
}

interface ChatWindowProps {
  userId: number;
  username: string;
  currentUserId: number;
}

function ChatWindow({
  userId,
  username,
  currentUserId
}: ChatWindowProps) {

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  // 🔥 NEW
  const [isTyping, setIsTyping] =
    useState(false);

  // 🔥 NEW
  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);


  /*
   * Load previous conversation
   */
  useEffect(() => {

    getMessages();

  }, [userId]);


  /*
   * Connect WebSocket
   */
  useEffect(() => {

    if (!currentUserId) {
      return;
    }

    connectWebSocket(

      currentUserId,

      // =========================
      // MESSAGE RECEIVED
      // =========================

      (incomingMessage: Message) => {

        console.log(
          "🔥 Incoming WebSocket message:",
          incomingMessage
        );

        const belongsToCurrentChat =
          (
            incomingMessage.senderId === userId &&
            incomingMessage.receiverId === currentUserId
          )
          ||
          (
            incomingMessage.senderId === currentUserId &&
            incomingMessage.receiverId === userId
          );

        if (!belongsToCurrentChat) {
          return;
        }

        setMessages((previousMessages) => {

          const alreadyExists =
            previousMessages.some(
              (message) =>
                message.id === incomingMessage.id
            );

          if (alreadyExists) {
            return previousMessages;
          }

          return [
            ...previousMessages,
            incomingMessage
          ];

        });

      },

      // =========================
      // TYPING RECEIVED
      // =========================

      (typingStatus: TypingStatus) => {

  console.log(
    "🔥 TYPING EVENT RECEIVED IN REACT = ",
    typingStatus
  );

  if (typingStatus.senderId !== userId) {
    console.log("senderId:", typingStatus.senderId);
console.log("current chat userId:", userId);
    console.log("Typing event ignored");
    return;
  }

  setIsTyping(typingStatus.typing);
}

    );

    return () => {

      disconnectWebSocket();

    };

  }, [currentUserId, userId]);


  /*
   * Scroll to latest message
   */
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);


  /*
   * Get previous messages
   */
  const getMessages = async () => {

    try {

      const response = await api.get(
        `/api/messages/${userId}`
      );

      setMessages(response.data);

    } catch (error) {

      console.error(
        "Failed to get messages:",
        error
      );

    }

  };


  /*
   * 🔥 NEW
   *
   * User is typing
   */
  const handleTyping = (
    value: string
  ) => {

    setContent(value);

    // If input is empty,
    // tell the other user we stopped typing.
    if (!value.trim()) {

      sendTypingStatus(
        userId,
        false
      );

      return;
    }

    // Tell receiver we are typing.
    sendTypingStatus(
      userId,
      true
    );

    // Clear previous timeout.
    if (typingTimeoutRef.current) {

      clearTimeout(
        typingTimeoutRef.current
      );

    }

    // If no typing happens for 1.5 seconds,
    // tell receiver that typing stopped.
    typingTimeoutRef.current =
      setTimeout(() => {

        sendTypingStatus(
          userId,
          false
        );

      }, 1500);

  };


  /*
   * Send live message
   */
  const sendMessage = () => {

    const trimmedContent =
      content.trim();

    if (!trimmedContent) {
      return;
    }

    console.log(
      "🔥 Sending WebSocket message:",
      trimmedContent
    );

    // Stop typing indicator
    sendTypingStatus(
      userId,
      false
    );

    sendWebSocketMessage(
      userId,
      trimmedContent
    );

    setContent("");

  };


  return (

    <div className="chat-window">

      {/* HEADER */}

      <div className="chat-header">

        <div className="avatar">

          {username
            .charAt(0)
            .toUpperCase()}

        </div>

        <div className="chat-user-info">

          <h3>{username}</h3>

          {/* 🔥 NEW */}
          {isTyping ? (
            <span className="typing-indicator">
              typing...
            </span>
          ) : (
            <span>online</span>
          )}

        </div>

      </div>


      {/* MESSAGES */}

      <div className="messages">

  {messages.map((message) => {
    const isMine =
      message.senderId === currentUserId;

    return (
      <div
        key={message.id}
        className={`message-row ${
          isMine
            ? "sent-row"
            : "received-row"
        }`}
      >
        <div
          className={`message ${
            isMine
              ? "sent"
              : "received"
          }`}
        >
          <div className="message-content">
            {message.content}
          </div>

          <div className="message-time">
            {new Date(
              message.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        </div>
      </div>
    );
  })}

  {isTyping && (
    <div className="typing-message-row">
      <div className="typing-bubble">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )}

  <div ref={messagesEndRef} />

</div>


      {/* INPUT */}

      <div className="message-input">

        <input
          type="text"
          placeholder="Type a message"
          value={content}

          // 🔥 CHANGED
          onChange={(e) =>
            handleTyping(e.target.value)
          }

          onKeyDown={(e) => {

            if (e.key === "Enter") {

              sendMessage();

            }

          }}
        />

        <button onClick={sendMessage}>
          ➤
        </button>

      </div>

    </div>

  );

}

export default ChatWindow;