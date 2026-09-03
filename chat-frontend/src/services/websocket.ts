import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const connectWebSocket = (
  userId: number,
  onMessageReceived: (message: any) => void,
  onTypingReceived: (typing: any) => void
) => {

  const token = localStorage.getItem("token");

  stompClient = new Client({

    brokerURL: "ws://localhost:8080/ws",

    connectHeaders: {
      Authorization: `Bearer ${token}`
    },

    reconnectDelay: 5000,

    onConnect: () => {

      console.log("WebSocket connected");

      // =========================
      // CHAT MESSAGES
      // =========================

      stompClient?.subscribe(
        "/user/queue/messages",
        (message: IMessage) => {

          console.log(
            "🔥 MESSAGE RECEIVED:",
            message.body
          );

          const data = JSON.parse(message.body);

          onMessageReceived(data);
        }
      );


      // =========================
      // TYPING INDICATOR
      // =========================

      stompClient?.subscribe(
        "/user/queue/typing",
        (message: IMessage) => {

          console.log(
            "⌨️ TYPING RECEIVED:",
            message.body
          );

          const data = JSON.parse(message.body);

          onTypingReceived(data);
        }
      );

    },

    onDisconnect: () => {

      console.log(
        "WebSocket disconnected"
      );

    },

    onStompError: (frame) => {

      console.error(
        "STOMP error:",
        frame.headers["message"]
      );

      console.error(frame.body);
    }

  });

  stompClient.activate();
};


// =================================
// SEND CHAT MESSAGE
// =================================

export const sendWebSocketMessage = (
  receiverId: number,
  content: string
) => {

  if (!stompClient?.connected) {

    console.error(
      "WebSocket is not connected"
    );

    return;
  }

  stompClient.publish({

    destination: "/app/chat",

    body: JSON.stringify({
      receiverId,
      content
    })

  });
};


// =================================
// SEND TYPING STATUS
// =================================

export const sendTypingStatus = (
  receiverId: number,
  isTyping: boolean
) => {

  if (!stompClient?.connected) {

    console.error(
      "WebSocket is not connected"
    );

    return;
  }

  stompClient.publish({

    destination: "/app/typing",

    body: JSON.stringify({
      receiverId,
      isTyping
    })

  });

};


// =================================
// DISCONNECT
// =================================

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};