import { useEffect, useState } from "react";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserListProps {
  selectedUserId: number | null;
  onUserSelect: (user: User) => void;
}

function UserList({
  selectedUserId,
  onUserSelect
}: UserListProps) {

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await api.get(
        "/api/users?page=0&size=20"
      );

      setUsers(response.data.content);

    } catch (error) {
      console.error("Failed to get users:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="user-list">

      {/* HEADER */}

      <div className="sidebar-header">
        <h2>Chats</h2>

        <button className="menu-button">
          ⋮
        </button>
      </div>

      {/* SEARCH */}

      <div className="search-container">

        <input
          type="text"
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* USERS */}

      <div className="users">

        {filteredUsers.map((user) => (

          <div
            key={user.id}
            className={`user-item ${
              selectedUserId === user.id
                ? "selected"
                : ""
            }`}
            onClick={() => onUserSelect(user)}
          >

            <div className="avatar">
              {user.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-info">

              <div className="username">
                {user.username}
              </div>

              <div className="last-message">
                Click to open chat
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default UserList;