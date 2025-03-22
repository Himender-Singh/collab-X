import { faPaperPlane, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveAs } from "file-saver";
import aiLogo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";

const AskBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const { user } = useSelector((store) => store.auth);
  const userImage = user?.profilePicture;

  // Auto-scroll to the bottom of the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Adjust input height dynamically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

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
      console.log(aiMessage);

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

    saveAs(blob, "chat-history.txt");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Code copied to clipboard!"))
      .catch(() => alert("Failed to copy code."));
  };

  const isCode = (content) => {
    return /```[\s\S]*```/.test(content);
  };

  const extractCode = (content) => {
    return content.replace(/```([\s\S]*?)```/g, "<code>$1</code>").trim();
  };

  const boldData = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<bold>$1</bold>") // Convert **bold** to <bold>
      .replace(/`([^`]+)`/g, "<code>$1</code>"); // Convert `inline code` to <code>
  };

  return (
    <div className="h-screen max-w-screen-lg mx-auto flex flex-col p-4 overflow-auto text-white scroll-hide scroll-smooth">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4">Chat with AI</h1>
        <button
          onClick={downloadChatHistory}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          style={{ height: "40px" }}
        >
          Download Conversation
        </button>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-2 rounded-lg"
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex my-16 items-start gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "user" ? (
              <img
                src={userImage}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <img src={aiLogo} alt="AI" className="w-8 h-8 rounded-full" />
            )}
            <div
              className={`max-w-[90%] p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {isCode(msg.content) ? (
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(extractCode(msg.content))}
                    className="absolute top-2 text-wrap right-2 p-1 rounded hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                  <Editor
                    height="700px" // Adjusted height
                    width="50rem"
                    defaultLanguage="c" // Set dynamically if possible
                    theme="vs-dark"
                    value={extractCode(msg.content)}
                    options={{
                      readOnly: true,
                      wrappingIndent: "deepIndent",
                      wrappingStrategy: "advanced",
                      wordWrap: "on",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2" {...props} />
                    ),
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
                          <code className="p-1 rounded" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="relative rounded-lg p-4">
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            className="absolute top-2 right-2 p-1 rounded hover:text-gray-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          <code
                            className="block whitespace-pre-wrap text-white"
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
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-400">Loading...</div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <form className="flex w-full" onSubmit={handleSendMessage}>
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg p-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            style={{ minHeight: "40px", maxHeight: "150px" }}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
            style={{ height: "40px" }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskBot;
