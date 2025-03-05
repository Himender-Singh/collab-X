import {
  faX,
  faPaperPlane,
  faExpand,
  faCompress,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import store from "@/redux/store";

const AiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: message },
    ];
    setChatHistory(updatedChatHistory);
    const prompt = message;
    setMessage("");

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const aiMessage = result.response.text();
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiMessage },
      ]);
    } catch (error) {
      console.error("Error calling Google Gemini API:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Code copied to clipboard!"))
      .catch(() => alert("Failed to copy code."));
  };

  return (
    <div>
      <button
        onClick={toggleChatbox}
        className="fixed z-[1000] bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <FaQuestionCircle size={30} />
      </button>

      <div
        className={`fixed transition-all duration-300 ease-in-out ${
          isOpen
            ? isFullScreen
              ? "inset-0 w-full h-full rounded-none"
              : "bottom-[1rem] z-[1200] right-4 w-96 h-[42rem] rounded-lg"
            : "opacity-0 pointer-events-none"
        } bg-gray-50 p-4 shadow-lg z-[1000] flex flex-col`}
      >
        <div className="bg-[#0156f9] rounded-lg text-white p-3 flex justify-between items-center">
          <span className="font-semibold text-lg">Chat with AI</span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-1 hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} />
            </button>
            <button
              onClick={toggleChatbox}
              className="p-1 hover:text-gray-200 transition-all duration-100 ease-in-out "
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 border rounded-lg border-blue-700 bg-gray-50 mt-2">
          {!chatHistory.length && (
            <div className="text-start text-5xl font-bold text-gray-800">
              <div className="p-2 flex justify-start gap-5 bg-yellow-200 w-full">
                <img src={logo} alt="logo" className="w-8" />
                <span className="text-3xl"> MY Self CollabX AI</span>
              </div>
              <p className="leading-tight">How can I help you today? </p>
              <p className="mt-4">👋 </p>
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg flex items-start gap-2 ${
                msg.role === "user"
                  ? "bg-[#0156f9] text-white self-end"
                  : "bg-white shadow-xl border text-black self-start"
              }`}
            >
              {msg.role === "user" ? (
                <img
                  src={user?.profilePicture}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img src={logo} alt="AI" className="w-8 h-8 rounded-full" />
              )}
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                    p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      if (inline) {
                        return (
                          <code className="bg-gray-700 p-1 rounded" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="relative">
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            className="absolute top-2 right-2 p-1 rounded text-black hover:text-gray-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          <code
                            className="block bg-gray-100 p-2 rounded whitespace-pre-wrap"
                            {...props}
                          >
                            {children}
                          </code>
                        </div>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-400">Loading...</div>
          )}
        </div>

        <form className="mt-4 flex w-full" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg p-2 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiBot;