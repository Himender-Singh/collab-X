import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setChat } from "@/redux/authSlice";
import { setMessages } from "@/redux/chatSlice";

const useGetSelectMessages = () => {
  const dispatch = useDispatch();
  const select = useSelector((store) => store.auth.selected);

  useEffect(() => {
    // Ensure `select` and `select._id` are defined before making API call
    if (!select || !select._id) {
      console.warn("No chat selected or missing chat ID.");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/chat/${select._id}`,
          {
            withCredentials: true,
          }
        );

        dispatch(setChat(response.data));
        dispatch(setMessages(response.data));

      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [select._id, dispatch]);
};

export default useGetSelectMessages;
