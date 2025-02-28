import { faPaperPlane, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveAs } from "file-saver"; // Import FileSaver

const AskBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const downloadChatHistory = () => {
    const textContent = chatHistory
      .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
      .join("\n");

    const blob = new Blob([textContent], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, "chat-history.txt"); // Change the file extension to .txt for simplicity
  };

  // Function to copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Code copied to clipboard!"))
      .catch(() => alert("Failed to copy code."));
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4">Chat with AI</h1>
        <button
          onClick={downloadChatHistory}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Download Conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 border rounded-lg border-gray-700 bg-gray-800">
        {/* Display chat history */}
        <div>
          <div className="text-center p-2 bg-red-900 rounded-lg my-2 text-gray-100">
            Chat and conversation are no longer supported...
          </div>
        </div>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-pink-600 text-white self-end" // Pink for user
                : "bg-purple-600 text-white self-start" // Violet for AI
            }`}
          >
            {/* Render Markdown content for both user and AI messages */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
              components={{
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ), // Bold text
                p: ({ node, ...props }) => <p className="mb-2" {...props} />, // Paragraphs with spacing
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5" {...props} />
                ), // Bullet points
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5" {...props} />
                ), // Numbered lists
                li: ({ node, ...props }) => <li className="mb-1" {...props} />, // List items
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

      <div className="flex justify-between mt-4">
        <form className="flex w-full" onSubmit={handleSendMessage}>
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
    </div>
  );
};

export default AskBot;