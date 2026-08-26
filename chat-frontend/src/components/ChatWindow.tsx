import { useEffect, useRef, useState } from "react";
import api from "../services/api";

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

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessage = async () => {

    if (!content.trim()) {
      return;
    }

    try {

      const response = await api.post(
        "/api/messages",
        {
          receiverId: userId,
          content: content
        }
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        response.data
      ]);

      setContent("");

    } catch (error) {

      console.error(
        "Failed to send message:",
        error
      );

    }
  };

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  };

  return (
    <div className="chat-window">

      {/* HEADER */}

      <div className="chat-header">

        <div className="avatar">
          {username.charAt(0).toUpperCase()}
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