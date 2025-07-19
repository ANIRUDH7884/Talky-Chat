import { useState } from "react";
import ChatList from "../../Components/ChatList/ChatList";
import "./Chat.scss";
import { BsChatDots } from "react-icons/bs"; // Chat icon

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div>
      <ChatList setActiveChat={setActiveChat} />
      <div>
        {activeChat ? (
          <div className="chat-box">
            <h2>{activeChat.username}</h2>
            <p>This is the chat window.</p>
          </div>
        ) : (
          <div className="chat-fallback">
            <div className="logo">
              <span className="logo-icon">TC</span>
            </div>
            <h2>Welcome to TalkyChat 💬</h2>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
