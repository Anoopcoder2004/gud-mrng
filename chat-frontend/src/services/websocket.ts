import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const connectWebSocket = (
  userId: number,
  onMessageReceived: (message: any) => void
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
    },

    onDisconnect: () => {
      console.log("WebSocket disconnected");
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


export const disconnectWebSocket = () => {

  if (stompClient) {

    stompClient.deactivate();

    stompClient = null;

  }
};