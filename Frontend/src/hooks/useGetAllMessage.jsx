import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { user, selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) return; // Don't fetch if no selected user

      try {
        const res = await axios.get(
          `https://try1-eupj.onrender.com/api/v1/message/all/${selectedUser?._id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages)); // Update Redux state
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllMessage();
  }, [selectedUser?._id, dispatch]);
};

export default useGetAllMessage;