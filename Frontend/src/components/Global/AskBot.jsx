import { FaPaperPlane, FaCopy, FaDownload, FaTrash, FaSpinner } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveAs } from "file-saver";
import aiLogo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";

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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
    if (chatHistory.length === 0) {
      alert("No chat history to download!");
      return;
    }

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
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  const clearChatHistory = () => {
    if (chatHistory.length === 0) return;
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setChatHistory([]);
      toast.success("Chat history cleared");
    }
  };

  const isCode = (content) => {
    return /```[\s\S]*```/.test(content);
  };

  const extractCode = (content) => {
    return content.replace(/```([\s\S]*?)```/g, "<code>$1</code>").trim();
  };

  return (
    <div className="h-screen  mx-auto flex flex-col p-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-400">AI Assistant</h1>
        <div className="flex gap-2">
          <button
            onClick={clearChatHistory}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={chatHistory.length === 0}
          >
            <FaTrash className="h-5 w-5" />
            Clear
          </button>
          <button
            onClick={downloadChatHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={chatHistory.length === 0}
          >
            <FaDownload className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <img src={aiLogo} alt="AI" className="w-24 h-24 mb-4 opacity-70" />
            <h2 className="text-xl font-medium mb-2">No conversations yet</h2>
            <p className="text-center max-w-md">
              Start chatting with the AI assistant by typing your message below.
              Ask anything about coding, productivity, or general knowledge!
            </p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-6 flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "user" ? (
                <img
                  src={userImage || "/default-user.png"}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <img
                  src={aiLogo}
                  alt="AI"
                  className="w-10 h-10 rounded-full bg-blue-500 p-1"
                />
              )}
              <div
                className={`max-w-[85%] rounded-lg p-2 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {isCode(msg.content) ? (
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(extractCode(msg.content))}
                      className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                      title="Copy code"
                    >
                      <FaCopy className="text-gray-300 h-4 w-4" />
                    </button>
                    <Editor
                      height="400px"
                      width="780px"
                      defaultLanguage="javascript"
                      autodetectLanguage="true"
                      saveViewState={false}
                      defaultValue={extractCode(msg.content)}
                      theme="vs-dark"
                      value={extractCode(msg.content)}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: "off",
                      }}
                    />
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-invert max-w-none"
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-3 leading-relaxed" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 mb-3" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 mb-3" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      code: ({ node, inline, className, children, ...props }) => {
                        if (inline) {
                          return (
                            <code
                              className="px-1.5 py-0.5 rounded bg-gray-600 text-sm"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        return (
                          <div className="relative my-3">
                            <button
                              onClick={() => copyToClipboard(String(children))}
                              className="absolute top-2 right-2 p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                              title="Copy code"
                            >
                              <FaCopy className="text-gray-300 h-4 w-4" />
                            </button>
                            <pre className="bg-gray-800 rounded p-4 overflow-x-auto text-sm">
                              <code {...props}>{children}</code>
                            </pre>
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
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <img
                src={aiLogo}
                alt="AI"
                className="w-10 h-10 rounded-full bg-blue-500 p-1"
              />
              <div className="bg-gray-700 text-white rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="sticky bottom-0 bg-gray-900 pt-4 pb-2"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-600 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            style={{ minHeight: "50px", maxHeight: "150px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading || !message.trim()}
            style={{ height: "50px", width: "50px" }}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : (
              <FaPaperPlane className="text-lg" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 pl-1">
          Press Shift+Enter for a new line
        </p>
      </form>
    </div>
  );
};

export default AskBot;