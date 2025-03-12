import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
        tasks: [],
        chat: [],
        selected: null,
        message: []
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            console.log("actions found",action.payload);
            state.selectedUser = action.payload;
        },
        setTasks: (state,action) => {
            state.tasks = action.payload;
        },
        setMessage: (state,action) => {
            state.message = action.payload;
        },
        setSelected: (state,action) => {
            state.selected = action.payload;
        },
        setChat: (state,action) => {
            state.chat = action.payload;
        },
        logout: (state) => {
            state.user = null; // Clear user data on logout
        },
        followingUpdate:(state,action)=>{
            // unfollow
            if(state.user.following.includes(action.payload)){
                state.user.following = state.user.following.filter((itemId)=>{
                    return itemId !== action.payload;
                })
            }else{
                // follow
                state.user.following.push(action.payload);
            }
        }
    },
});

export const {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile,
    setSelectedUser,
    setSelected,
    setTasks,
    setChat,
    logout,
    followingUpdate
} = authSlice.actions;

export default authSlice.reducer;
