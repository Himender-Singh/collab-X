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
  
  const AiBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
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
  
    // Function to copy code to clipboard
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
  
        {isOpen && (
          <div
            className={`fixed ${
              isFullScreen
                ? "inset-0 w-full h-full rounded-none"
                : "bottom-[5rem] right-4 w-96 h-[34rem] rounded-lg"
            } bg-gray-900 p-4 shadow-lg z-50 transition-all duration-300 ease-in-out flex flex-col`}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white p-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Chat with AI</span>
              <div className="flex items-center gap-2">
                {/* Full-screen toggle button */}
                <button
                  onClick={toggleFullScreen}
                  className="p-1 hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} />
                </button>
                {/* Close chatbox button */}
                <button
                  onClick={toggleChatbox}
                  className="p-1 hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
  
            {/* Chat body */}
            <div className="flex-1 overflow-y-auto p-2 border rounded-lg border-gray-700 bg-gray-800 mt-2">
              {/* Display chat history */}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-pink-600 text-white self-end" // Pink for user
                      : "bg-purple-600 text-white self-start" // Violet for AI
                  }`}
                >
                  {/* Render Markdown content */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
                    components={{
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold" {...props} />
                      ), // Bold text
                      p: ({ node, ...props }) => (
                        <p className="mb-2" {...props} />
                      ), // Paragraphs with spacing
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5" {...props} />
                      ), // Bullet points
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5" {...props} />
                      ), // Numbered lists
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ), // List items
                      code: ({ node, inline, className, children, ...props }) => {
                        // Add a copy button for code blocks
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
                              className="absolute top-2 right-2 bg-gray-700 p-1 rounded hover:bg-gray-600 transition-colors"
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </button>
                            <code
                              className="block bg-gray-700 p-2 rounded whitespace-pre-wrap"
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
              ))}
              {isLoading && (
                <div className="text-center text-gray-400">Loading...</div>
              )}
            </div>
  
            {/* Chat input form */}
            <form className="mt-4 flex w-full" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border rounded-lg p-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="ml-2 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };
  
  export default AiBot;