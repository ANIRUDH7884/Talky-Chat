import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiUserPlus, FiChevronRight } from "react-icons/fi";
import apiClient from "../../Config/ApiClient/ApiClient";
import "./NewChat.scss";

const ChatUrl = import.meta.env.VITE_API_CHAT_URL;
const UserUrl = import.meta.env.VITE_API_USER_URL;

const NewChat = ({ isOpen, onClose, setActiveChat, refreshChatList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`${UserUrl}users`);
      const currentUserId = localStorage.getItem("userId");
      const filteredUsers = res.data.users.filter(
        (user) => user._id !== currentUserId
      );
      setUsers(filteredUsers);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await apiClient.post(`${ChatUrl}access-chat`, { userId });
      const currentUserId = localStorage.getItem("userId");

      const chat = res.data.existingChat || res.data.fullChat;

      if (!chat || !chat.participants) {
        throw new Error("Participants not found in chat response");
      }

      const targetUser = chat.participants.find((p) => p._id !== currentUserId);

      setActiveChat({
        id: chat._id,
        username: targetUser?.username,
        profilePic: targetUser?.profilePic,
        isOnline: targetUser?.isOnline,
      });

      onClose();
    } catch (err) {
      console.error("Error starting chat:", err);
      setError("Failed to start chat. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className={`new-chat-overlay ${isOpen ? "visible" : ""}`}>
      <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>New Message</h2>
            <button onClick={onClose} className="close-button">
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search people"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading contacts...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">!</div>
              <p>{error}</p>
              <button onClick={fetchUsers} className="retry-button">
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <FiUserPlus className="empty-icon" />
              <h3>No contacts found</h3>
              <p>
                {searchTerm
                  ? "Try a different search"
                  : "All your contacts appear here"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="clear-search-btn"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="users-list">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="user-item"
                  onClick={() => handleStartChat(user._id)}
                >
                  <div className="user-avatar">
                    <img
                      src={
                        user.profilePic ||
                        `https://ui-avatars.com/api/?name=${user.username}`
                      }
                      alt={user.username}
                    />
                    {user.isOnline && <span className="online-dot"></span>}
                  </div>
                  <div className="user-details">
                    <h4>{user.username}</h4>
                    <p className="user-status">
                      {user.isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                  <FiChevronRight className="chevron-icon" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChat;
