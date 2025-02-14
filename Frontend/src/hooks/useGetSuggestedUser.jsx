import { server } from "@/main";
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector to access the state

const useGetSuggestedUser = () => {
    const dispatch = useDispatch();
    const suggestedUsers = useSelector((state) => state.auth.suggestedUsers); 

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${server}/user/suggested`, { withCredentials: true });
                
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log('API Error:', error); // Log any errors
            }
        };
        fetchSuggestedUsers();
    }, [dispatch]); // Add dispatch to the dependency array
    
    return { suggestedUsers }; // Return the suggestedUsers
};

export default useGetSuggestedUser;
