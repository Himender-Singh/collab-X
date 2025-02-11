import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setChat, setSelected } from "@/redux/authSlice";

const useGetChat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/chat/all",
          {
            withCredentials: true, // Ensure credentials are sent with the request
          }
        );
        console.log(response,"res from chat");
        dispatch(setChat(response.data)); // Dispatch the action to set chat data in Redux
        setSelected(response.data[0]._id);
        // console.log(response.data[0]._id);
        console.log(response.data , "selected data");
      } catch (err) {
        console.error("Error fetching chats:", err);
      } 
    };

    fetchChats();
  }, [dispatch]); // Add dispatch to the dependency array
 // Return loading and error states if needed
};

export default useGetChat;
