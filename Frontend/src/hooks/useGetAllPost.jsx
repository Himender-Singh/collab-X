import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPost = async () => {
            setLoading(true); 
            try {
                const res = await axios.get('http://localhost:8080/api/v1/post/all', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setPosts(res.data.posts));
                } else {
                    setError("Failed to fetch posts");
                    toast.error("Failed to find posts");
                }
            } catch (error) {
                setError(error.message);
                toast.error("Error fetching posts");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllPost();
    }, [dispatch]);

    return { loading, error };
};

export default useGetAllPost;
