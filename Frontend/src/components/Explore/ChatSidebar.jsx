import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Chats from "./Chats";

const ChatSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const [matchedFollowers, setMatchedFollowers] = useState([]);
  const [matchedFollowing, setMatchedFollowing] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const data = useGetSuggestedUser();

  console.log(data);

  const isFollowersLoaded = useRef(false);
  const isFollowingLoaded = useRef(false);

  useEffect(() => {
    if (isFollowersLoaded.current) return;

    if (data?.suggestedUsers && user?.followers) {
      const matched = user.followers
        .map((followerId) => {
          const matchedUser = data.suggestedUsers.find(
            (user) => user._id === followerId
          );
          return matchedUser
            ? {
                username: matchedUser.username,
                profilePicture: matchedUser.profilePicture,
                bio: matchedUser.bio,
                _id: matchedUser._id,
              }
            : null;
        })
        .filter(Boolean);

      setMatchedFollowers(matched);
      sessionStorage.setItem("matchedFollowers", JSON.stringify(matched));
      isFollowersLoaded.current = true;
    }
  }, [data?.suggestedUsers, user?.followers]);

  useEffect(() => {
    if (isFollowingLoaded.current) return;

    if (data?.suggestedUsers && user?.following) {
      const matched = user.following
        .map((followingId) => {
          const matchedUser = data.suggestedUsers.find(
            (user) => user._id === followingId
          );
          return matchedUser
            ? {
                username: matchedUser.username,
                profilePicture: matchedUser.profilePicture,
                bio: matchedUser.bio,
                _id: matchedUser._id,
              }
            : null;
        })
        .filter(Boolean);

      setMatchedFollowing(matched);
      sessionStorage.setItem("matchedFollowing", JSON.stringify(matched));
      isFollowingLoaded.current = true;
    }
  }, [data?.suggestedUsers, user?.following]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with Scrollable List */}
      <div className="w-1/3 border-r border-gray-300 bg-white p-5 flex flex-col">
        {/* User Info */}
        <div className="text-2xl font-bold capitalize border-b pb-3 mb-4">
          {user?.username}
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Followers List */}
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b pb-2">Followers</h2>
            {matchedFollowers.length > 0 ? (
              matchedFollowers.map((follower) => (
                <div
                  key={follower._id}
                  className="flex items-center gap-2 mt-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                  onClick={() => handleUserClick(follower)}
                >
                  <img
                    src={follower.profilePicture}
                    alt="follower"
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{follower.username}</p>
                    <p className="text-gray-500 text-sm">{follower.bio}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-2">No followers yet</p>
            )}
          </div>

          {/* Suggested Users List */}
          <div>
            <h2 className="text-lg font-bold border-b pb-2">Suggested Users</h2>
            {data?.suggestedUsers.length > 0 ? (
              data.suggestedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 mt-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={user.profilePicture}
                    alt="suggested-user"
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-gray-500 text-sm">{user.bio}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-2">No suggestions available</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-2/3">
        <Chats selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatSidebar;
