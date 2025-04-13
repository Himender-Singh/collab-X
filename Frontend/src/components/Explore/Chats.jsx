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
        `https://try1-eupj.onrender.com/api/v1/message/send/${selectedUser._id}`,
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

  console.log(messages);

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null)); // Reset selected user on unmount
    };
  }, [dispatch]);

  return (
    <div className="flex bg-black/50  w-full backdrop-blur-xl flex-col h-[730px] relative z-[15000] text-white shadow-md rounded-lg">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.profilePicture}
                alt="User"
                className="w-12 h-12 rounded-full border border-gray-600"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedUser.username}
                </h2>
                <p className="text-sm text-gray-400">{selectedUser.bio}</p>
              </div>
            </div>
            <Link to={`/profile/${selectedUser._id}`}>
              <button className="px-4 py-2 text-blue-400 border border-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition-all">
                View Profile
              </button>
            </Link>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex flex-col items-center p-12 text-gray-400 text-lg">
              <img
                src={selectedUser.profilePicture}
                alt="profile"
                className="w-28 rounded-full h-28"
              />
              <span className="font-bold text-xl capitalize mt-2 text-white">
                {selectedUser.username}
              </span>
              <span className="font-bold text-xl capitalize mt-2 text-white">
                {selectedUser?.bio}
              </span>

              <Link to={`/profile/${selectedUser._id}`}>
                <button className="px-4 mt-10 py-2 text-blue-400 border border-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition-all">
                  View Profile
                </button>
              </Link>
            </div>

            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg, index) => (
                <>
                  <p className="text-xs text-center p-12 text-gray-400 mt-1">
                    {msg.createdAt?formatTimestamp(msg.createdAt):""}
                  </p>
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.senderId === user?._id
                        ? "bg-blue-600 text-white self-end ml-auto"
                        : "bg-gray-700 text-gray-200 self-start"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </>
              ))
            ) : (
              <div className="flex flex-col items-center text-gray-400 text-lg">
                
                Start a conversation with {selectedUser.username}...
                
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={textMessage}
              onKeyDown={handleKeyPress}
              onChange={(e) => setTextMessage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg outline-none bg-[#1a1a1a] text-white"
            />
            <button
              onClick={handleSendMessage}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
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
