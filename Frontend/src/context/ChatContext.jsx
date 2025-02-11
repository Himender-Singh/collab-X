import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);

  async function fetchResponse() {
    if (prompt === "") return alert("Write prompt");
    setNewRequestLoading(true);
    setPrompt("");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD4L9CbisKJrOV75prZOq3NPKgpef_HcKE",
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });

      const message = {
        question: prompt,
        answer:
          response["data"]["candidates"][0]["content"]["parts"][0]["text"],
      };

      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);

      const { data } = await axios.post(
        `http://localhost:8000/api/chat/${selected}`,
        {
          question: prompt,
          answer:
            response["data"]["candidates"][0]["content"]["parts"][0]["text"],
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      alert("someting went wrong");
      console.log(error);
    }
  }

  const [chats, setChats] = useState([]);

  const [selected, setSelected] = useState(null);

  async function fetchChats() {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setChats(data);
      setSelected(data[0]._id);
    } catch (error) {
      console.log(error);
    }
  }

  const [createLod, setCreateLod] = useState(false);

  async function createChat() {
    setCreateLod(true);
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/chat/new`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      fetchChats();
      setCreateLod(false);
    } catch (error) {
      toast.error("some went wrong");
      setCreateLod(false);
    }
  }

  const [loading, setLoading] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`http://localhost:8000/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selected]);
  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);