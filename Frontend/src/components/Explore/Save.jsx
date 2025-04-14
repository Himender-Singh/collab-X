import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ChatSidebar from "./ChatSidebar"; // Assuming you have a sidebar component
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "@/redux/authSlice";
import ReactMarkdown from 'react-markdown';

const parseResponse = (text) => {
  // Format to Markdown syntax:
  const formattedText = text
    .replace(/\*\*/g, '')                 // Remove unintended asterisks
    .replace(/\*\s/g, '- ')               // Convert * bullets to - bullets
    .replace(/##\s/g, '\n**')             // Convert headings to bolded text
    .replace(/Resources:/g, '**Resources:**'); // Bold specific sections like "Resources"

  return (
    <div className="space-y-4 p-4 text-gray-200">
      <ReactMarkdown
        components={{
          // Tailwind classes for list styling
          ul: ({ children }) => <ul className="list-disc list-inside space-y-2">{children}</ul>,
          li: ({ children }) => <li className="ml-4">{children}</li>,
          // Tailwind classes for bold text
          strong: ({ children }) => <strong className="font-semibold text-blue-600">{children}</strong>,
          // Tailwind classes for line breaks and paragraphs
          p: ({ children }) => <p className="mt-2">{children}</p>
        }}
      >
        {formattedText}
      </ReactMarkdown>
    </div>
  );
};

const Ask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectedChatId = useSelector((store) => store.auth.selected);
  const dispatch = useDispatch();

  // Effect to load chat history when the selected chat changes
  useEffect(() => {
    if (selectedChatId) {
      fetchChatMessages(selectedChatId);
    }
  }, [selectedChatId]);


  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `https://try1-eupj.onrender.com/api/v1/chat/${chatId}`,
        { withCredentials: true }
      );
  
      const chatData = response.data;
  
      if (Array.isArray(chatData) && chatData.length > 0) {
        const transformedMessages = chatData.map((msg) => [
          { type: "user", text: msg.question },
          { type: "bot", text: parseResponse(msg.answer) },
        ]).flat();
  
        setMessages(transformedMessages);
        dispatch(setChat(chatData));
      } else {
        console.log("No valid chat data found or messages array is empty.");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to load chat messages.");
    }
  };
  
  
  

  const handleSendMessage = async () => {
    if (!searchTerm.trim()) return;

    const newMessages = [...messages, { type: "user", text: searchTerm }];
    setMessages(newMessages);
    setSearchTerm("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD4L9CbisKJrOV75prZOq3NPKgpef_HcKE",
        {
          contents: [{ parts: [{ text: searchTerm }] }], 
        }
      );

      if (response.status === 200) {
        const botResponse =
          response.data.candidates[0]?.content?.parts[0]?.text ||
          "Sorry, no response available.";
        const formattedResponse = parseResponse(botResponse);

        setMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            { type: "bot", text: formattedResponse },
          ];
          return updatedMessages;
        });
      } else {
        toast.error("Error fetching response from Gemini API");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      toast.error("An error occurred while processing your request.");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          text: "An error occurred while processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-[#020617]">
        <ChatSidebar />
      </div>
      <div className="flex-1 relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-xs md:max-w-md ${
                message.type === "user" ? "ml-auto text-left" : "ml-4 text-left"
              }`}
            >
              <div
                className={`p-4 rounded-lg shadow-md transition-transform duration-300 ease-in-out ${
                  message.type === "user" ? "bg-gray-800 text-white" : "bg-gray-800 text-white"
                }`}
              >
                {message.type === "bot" ? message.text : message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-start">
              <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
              <span className="text-gray-200">Loading...</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center pb-10">
          <div className="relative w-full max-w-3xl px-4">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Ask a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-8">
              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center w-28 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-200 shadow-md"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span className="pl-2">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask;
