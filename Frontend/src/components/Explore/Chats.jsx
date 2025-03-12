import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import { setSelectedUser } from "@/redux/authSlice";
import axios from "axios";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Chats = ({ selectedUser }) => {
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  useGetAllMessage();
  useGetRTM();

  // Filter messages for the selected user
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === user?._id && msg.receiverId === selectedUser?._id) ||
      (msg.senderId === selectedUser?._id && msg.receiverId === user?._id)
  );

  const handleSendMessage = async () => {
    if (!textMessage.trim()) return; // Prevent empty messages

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${selectedUser._id}`,
        { textMessage: textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage])); // Update Redux state
        setTextMessage(""); // Clear input after send
      }
    } catch (error) {
      console.error("Message Send Error:", error);
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null)); // Reset selected user on unmount
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col h-[730px] relative z-[15000] bg-white shadow-md rounded-lg">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.profilePicture}
                alt="User"
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedUser.username}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.bio}</p>
              </div>
            </div>
            <Link to={`/profile/${selectedUser._id}`}>
              <button className="px-4 py-2 text-blue-600 border border-blue-500 rounded-md hover:bg-blue-100">
                View Profile
              </button>
            </Link>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.senderId === user?._id
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-lg">
                <img
                  src={selectedUser.profilePicture}
                  alt="profile"
                  className="w-28 rounded-full h-28"
                />
                Start a conversation with {selectedUser.username}...
                <Link to={`/profile/${selectedUser._id}`}>
                  <button className="px-4 mt-10 py-2 text-blue-600 border border-blue-500 rounded-md hover:bg-blue-100">
                    View Profile
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={textMessage}
              onKeyDown={handleKeyPress}
              onChange={(e) => setTextMessage(e.target.value)}
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
          <h2 className="text-2xl font-semibold">
            Select a user to start chatting
          </h2>
        </div>
      )}
    </div>
  );
};

export default Chats;