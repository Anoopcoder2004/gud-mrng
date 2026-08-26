import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage
} from "../services/websocket";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
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

    // 🔥 CHANGED
    if (!currentUserId) {
      return;
    }

    connectWebSocket(
      currentUserId,

      (incomingMessage: Message) => {

        console.log(
          "🔥 Incoming WebSocket message:",
          incomingMessage
        );

        /*
         * Only update the currently selected
         * conversation.
         */
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

        // 🔥 CHANGED
        if (!belongsToCurrentChat) {
          return;
        }

        // 🔥 CHANGED
        setMessages((previousMessages) => {

          /*
           * Prevent duplicate messages.
           *
           * This is useful because the REST API and
           * WebSocket can both contain the same message.
           */
          const alreadyExists =
            previousMessages.some(
              (message) =>
                message.id === incomingMessage.id
            );

          if (alreadyExists) {
            return previousMessages;
          }

          console.log(
            "🔥 Adding WebSocket message to UI:",
            incomingMessage
          );

          return [
            ...previousMessages,
            incomingMessage
          ];

        });

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

    sendWebSocketMessage(
      userId,
      trimmedContent
    );

    // 🔥 CHANGED
    // Do NOT add the message here.
    //
    // Backend saves the message and sends it
    // back through WebSocket.
    //
    // The WebSocket callback above will update
    // the UI.

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

          <span>online</span>

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

        <div ref={messagesEndRef} />

      </div>


      {/* INPUT */}

      <div className="message-input">

        <input
          type="text"
          placeholder="Type a message"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
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