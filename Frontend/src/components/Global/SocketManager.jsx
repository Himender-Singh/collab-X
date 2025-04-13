import { setOnlineUsers } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/rtnSlice";
import { setSocket } from "@/redux/socketSlice";
import store from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketManager = () => {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  const {selectedUser} = useSelector(store=>store.auth);

  useEffect(() => {
    if (user) {
      const socketio = io("https://try1-eupj.onrender.com", {
        query: { userId: user?._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return null; // This component doesn't render UI, it only handles logic
};

export default SocketManager;
