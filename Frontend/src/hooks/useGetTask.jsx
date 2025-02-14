import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setTasks } from "@/redux/authSlice";
import { server } from "@/main";

const useGetTask = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(`${server}/task/getUserTask`, {
                    withCredentials: true,
                });
                // console.log(res);
                if (res.data.success) {
                    dispatch(setTasks(res.data.tasks)); // Dispatch tasks to Redux store
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast.error("Failed to fetch tasks");
            }
        };

        fetchTask();
    }, [dispatch]); // Add dispatch to the dependency array
};

export default useGetTask;
