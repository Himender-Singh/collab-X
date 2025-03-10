import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Chats = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add new message to the chat
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: "You" }]);
    setMessage(""); // Clear input field
  };

  return (
    <div className="flex flex-col h-[730px] relative z-[15000] bg-white shadow-md rounded-lg">
      {selectedUser ? (
        <>
          {/* Header with user info */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.profilePicture}
                alt="User"
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <div>
                <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
                <p className="text-sm text-gray-500">{selectedUser.bio}</p>
              </div>
            </div>
            <Link to={`/profile/${selectedUser._id}`} >
            <button className="px-4 py-2 text-blue-600 border border-blue-500 rounded-md hover:bg-blue-100">
              View Profile
            </button>
            </Link>
          </div>

          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === "You"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Start a conversation with {selectedUser.username}...
              </div>
            )}
          </div>

          {/* Message input field */}
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img src={logo} alt="Logo" className="w-32 h-32 mb-5" />
          <h2 className="text-2xl font-semibold">Select a user to start chatting</h2>
        </div>
      )}
    </div>
  );
};

export default Chats;
