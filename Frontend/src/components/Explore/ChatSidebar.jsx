import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faMinimize,
  faMaximize,
  faPlus,
  faTrash,
  faSpinner,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import useGetChat from "@/hooks/useGetChat";
import { setChat, setSelected } from "@/redux/authSlice";
import useGetSelectMessages from "@/hooks/useGetSelectMessages";
import { server } from "@/main";

const ChatSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chats = useSelector(store => store.auth.chat);
  const selectedChat = useSelector((store) => store.auth.selected);
  const loggedInUser = useSelector((store) => store.auth);

  useGetChat();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleNewChat = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true); // Start loading before the API call
  
      const res = await axios.post(
        "http://localhost:8000/api/v1/chat/new",
        {},
        {
          withCredentials: true,
        }
      );
  
      if (res.data && res.data._id) {
        // Dispatch the action to add the new chat to the Redux state
        const newChats = {
          _id: res.data._id,
          latestMessage: res.data.latestMessage || "New Chat",
          name: res.data.name || "New Chat", // Ensure you include a name
        };
        dispatch(setChat((prevChats) => [...prevChats, newChats]));
        toast.success("New chat created successfully!");
        
        // Refresh the page after creating a new chat
        window.location.reload(); // This will reload the page
      }
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
      console.log(error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      // Send DELETE request to server
      await axios.delete(`${server}/chat/${chatId}`, {
        withCredentials: true, // Include credentials if needed
      });

      // Dispatch the action to remove the chat from the Redux state
      dispatch(setChat((prevChats) => prevChats.filter((chat) => chat._id !== chatId)));

      toast.success("Chat deleted successfully!");
      
      // Refresh the chat list after deleting
      window.location.reload(); // Reloads the page to reflect the change
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while deleting the chat.");
      console.log(error);
    }
  };

  const handleSelectChat = (chat) => {
    dispatch(setSelected(chat));  // Update the selected chat in Redux
  };

  // Ensure chats is always an array
  const validChats = Array.isArray(chats) ? chats : [];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#1a1a1a] border-r border-gray-700 shadow-lg p-4 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-80"}`}
    >
      <a
        href="/"
        className={`flex items-center mb-4 transition-opacity duration-300 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={logo}
          alt="Logo"
          className="h-10 transition-all duration-300"
        />
      </a>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-[-24px] bg-blue-900 text-white p-2 rounded-full"
      >
        <FontAwesomeIcon icon={isCollapsed ? faMaximize : faMinimize} />
      </button>
      <button
        onClick={handleNewChat}
        className={`flex items-center justify-center gap-2 px-4 py-2 mb-4 bg-green-600 text-white rounded-lg transition-all duration-300 ${
          isCollapsed ? "w-10 h-10 p-0" : "w-full"
        }`}
      >
        {!isCollapsed && <span className="font-semibold">New Chat</span>}
        <FontAwesomeIcon icon={faPlus} className="text-lg" />
      </button>
      <h2
        className={`text-xl font-semibold mb-4 text-white transition-opacity duration-300 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        Chats
      </h2>

      {loading ? (
        <p className="text-gray-400 flex items-center">
          <FontAwesomeIcon icon={faSpinner} spin /> Loading chats...
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : validChats.length === 0 ? (
        <p className="text-gray-400">No chats available.</p>
      ) : (
        <div
          className={`flex flex-col gap-3 overflow-y-auto transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          {validChats.map((chatItem) => (
            <div
              key={chatItem._id}
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer relative group"
              onClick={() => handleSelectChat(chatItem._id)} // Select chat on click
            >
              <div className="w-10 h-10 mr-3">
                <FontAwesomeIcon
                  icon={chatItem.user ? faUserCircle : faRobot}
                  className="text-gray-400 text-3xl"
                />
              </div>
              <div className={`flex-1 ${isCollapsed ? "hidden" : "block"}`}>
                <h3 className="font-semibold text-gray-200">{chatItem.name}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {chatItem.latestMessage}
                </p>
              </div>
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chatItem._id);
                  }}
                  className="absolute right-2 text-gray-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
