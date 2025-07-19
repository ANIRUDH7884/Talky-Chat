import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiUserPlus } from "react-icons/fi";
import apiClient from "../../Config/ApiClient/ApiClient";
import "./ChatList.scss";

const ChatUrl = import.meta.env.VITE_API_CHAT_URL;

const ChatList = ({ setActiveChat }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chatList, setChatList] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await apiClient.get(`${ChatUrl}/`);
        const { chats } = res.data;

        const formattedChats = chats.map((chat) => {
          const otherUser = chat.participants.find(
            (user) => user._id !== localStorage.getItem("userId")
          );

          return {
            id: chat._id,
            username: otherUser?.username || "Unknown",
            profilePic: otherUser?.profilePic || "",
            lastMessage: chat.latestMessage?.content || "No messages yet",
            time: new Date(chat.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: 0,
            isOnline: otherUser?.isOnline || false,
          };
        });

        setChatList(formattedChats);

        const counts = {};
        formattedChats.forEach((chat) => {
          counts[chat.id] = chat.unread;
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    setUnreadCounts((prev) => ({ ...prev, [chat.id]: 0 }));
  };

  const filteredChats = chatList.filter((chat) =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <div className="header-content">
          <h2>Chats</h2>
          <button
            className="new-chat-btn"
            onClick={() => console.log("Open user list modal")}
          >
            <FiUserPlus />
          </button>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-container">
          <FiSearch className="icon search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <FiX className="icon clear-icon" />
            </button>
          )}
        </div>
      </div>

      <div className="chat-list-container">
        <div className="chat-list">
          {filteredChats.length === 0 ? (
            <div className="no-chats-fallback">
              <p>
                💬 You don’t have any conversations yet.
                <br />
                Start chatting now!
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                className={`chat-list-item ${
                  unreadCounts[chat.id] > 0 ? "unread" : ""
                }`}
                key={chat.id}
                onClick={() => handleChatClick(chat)}
              >
                <div className="avatar-container">
                  <img
                    src={
                      chat.profilePic ||
                      `https://ui-avatars.com/api/?name=${chat.username}`
                    }
                    alt="avatar"
                    className="avatar"
                  />
                  {chat.isOnline && <span className="online-badge"></span>}
                </div>
                <div className="chat-info">
                  <div className="chat-header">
                    <h4>{chat.username}</h4>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <div className="chat-preview">
                    <p className="last-message">
                      {chat.lastMessage.length > 25
                        ? `${chat.lastMessage.substring(0, 25)}...`
                        : chat.lastMessage}
                    </p>
                    {unreadCounts[chat.id] > 0 && (
                      <span className="unread-count">
                        {unreadCounts[chat.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
