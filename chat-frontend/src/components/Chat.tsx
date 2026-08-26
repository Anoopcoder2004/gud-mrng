import { useEffect, useState } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
}

function Chat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/api/users/me");

      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error("Failed to get current user:", error);
    }
  };

  return (
    <div className="chat-container">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <UserList
          selectedUserId={selectedUser?.id ?? null}
          onUserSelect={setSelectedUser}
        />
      </aside>

      {/* RIGHT CHAT */}
      <main className="chat-main">

        {selectedUser && currentUserId ? (
          <ChatWindow
            userId={selectedUser.id}
            username={selectedUser.username}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <h2>Welcome to Chat</h2>
            <p>Select a user from the left to start chatting</p>
          </div>
        )}

      </main>

    </div>
  );
}

export default Chat;