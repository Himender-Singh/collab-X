import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { toast } from "react-toastify";
import axios from "axios";
import { followingUpdate } from "@/redux/authSlice";
import { server } from "@/main";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import { setSelectedPost } from "@/redux/postSlice"; // Import the action
import CommentDialog from "./CommentDialog";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId); // Fetch user profile based on userId
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const { selectedPost } = useSelector((store) => store.post); // Get selectedPost from Redux store
  const dispatch = useDispatch();
  const data = useGetSuggestedUser();
  const [matchedFollowers, setMatchedFollowers] = useState([]);
  const [matchedFollowing, setMatchedFollowing] = useState([]);
  const [open, setOpen] = useState(false);

  // Check if userProfile data is still loading
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // Check if the logged-in user is viewing their own profile
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following.includes(userProfile?._id); // Determine if the logged-in user is following the target user
  const userRole = userProfile?.role || "Student";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const followAndUnfollowHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${server}/user/followorunfollow/${userProfile?._id}`,
        { userId: user?._id }
      );
      window.location.reload();
      dispatch(followingUpdate(userProfile?._id)); // Update the following state in Redux
      // toast.success(res.data.message);
    } catch (error) {
      console.error("Error following/unfollowing:", error.response);
      toast.error(error.response.data.message);
    }
  };

  // Determine which posts to display based on the active tab
  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts || []
      : userProfile?.bookmarks || [];
  const displayedFollowers =
    activeTab === "followers" ? userProfile?.followers || [] : [];
  const displayedFollowing =
    activeTab === "following" ? userProfile?.following || [] : [];

  // Match follower IDs with user data
  useEffect(() => {
    if (data?.suggestedUsers && userProfile?.followers) {
      const matched = userProfile.followers.map((followerId) => {
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
      });
      setMatchedFollowers(matched.filter((follower) => follower !== null));
    }
  }, [data, userProfile?.followers]);

  // Match following IDs with user data
  useEffect(() => {
    if (data?.suggestedUsers && userProfile?.following) {
      const matched = userProfile.following.map((followingId) => {
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
      });
      setMatchedFollowing(matched.filter((following) => following !== null));
    }
  }, [data, userProfile?.following]);  

  return (
    <div className="flex flex-col sm:flex-row sm:max-w-5xl justify-center mx-auto p-5 md:p-8 lg:p-10 text-gray-100">
      <div className="flex flex-col gap-10 sm:gap-20 p-5 sm:p-10 w-full">
        <div className="flex flex-col sm:flex-row sm:gap-10">
          <section className="flex justify-center sm:w-1/3">
            <Avatar className="h-32 w-32 shadow-lg">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="flex flex-col gap-5 sm:w-2/3">
            <div className="flex">
              <span className="text-xl mt-5 sm:text-2xl mr-4 font-semibold">
                {userProfile?.username}
              </span>
              {isLoggedInUserProfile ? (
                <div className="flex sm:gap-2 mt-5 gap-5">
                  <Link to="/edit">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-700 hover:text-white h-8 sm:h-10 text-sm sm:text-base"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <div className="hidden sm:flex gap-2">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-700 hover:text-white h-8 sm:h-10 text-sm sm:text-base"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-700 hover:text-white  h-8 sm:h-10 text-sm sm:text-base"
                    >
                      Ad Tools
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-5 sm:gap-5">
                  <Button
                    onClick={followAndUnfollowHandler}
                    className={`h-8 sm:h-10 text-sm sm:text-base ${
                      isFollowing
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-8 sm:h-10 text-sm sm:text-base"
                  >
                    {userRole}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <p>
                <span className="font-semibold text-gray-100">
                  {userProfile?.posts?.length || 0}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold text-gray-100">
                  {userProfile?.followers?.length || 0}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold text-gray-100">
                  {userProfile?.following?.length || 0}
                </span>{" "}
                following
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-200">
                {userProfile?.bio || "bio here..."}
              </span>
              <Badge className="w-fit bg-gray-700 hover:bg-white hover:text-gray-700 text-gray-300">
                <AtSign /> <span className="pl-1">{userProfile?.username}</span>
              </Badge>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-700 mt-4">
          <div className="flex justify-center md:text-lg text-xs gap-4 md:gap-10 text-gray-300">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold text-gray-100" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold text-gray-100" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "followers" ? "font-bold text-gray-100" : ""
              }`}
              onClick={() => handleTabChange("followers")}
            >
              FOLLOWERS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "following" ? "font-bold text-gray-100" : ""
              }`}
              onClick={() => handleTabChange("following")}
            >
              FOLLOWING
            </span>
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            {activeTab === "followers" ? (
              matchedFollowers.length > 0 ? (
                matchedFollowers.map((follower) => (
                  <div
                    key={follower._id}
                    className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={follower.profilePicture}
                        alt={follower.username}
                      />
                      <AvatarFallback>
                        {follower.username && follower.username.length > 0
                          ? follower.username.charAt(0).toUpperCase()
                          : "N"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-200 font-medium">
                        {follower.username || "Anonymous"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {follower.bio || "Bio is unavailable"}
                      </p>
                    </div>
                    <Link to={`/profile/${follower._id}`} className="ml-auto">
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center w-full">
                  No followers yet.
                </p>
              )
            ) : activeTab === "following" ? (
              matchedFollowing.length > 0 ? (
                matchedFollowing.map((following) => (
                  <div
                    key={following._id}
                    className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={following.profilePicture}
                        alt={following.username}
                      />
                      <AvatarFallback>
                        {following.username && following.username.length > 0
                          ? following.username.charAt(0).toUpperCase()
                          : "N"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-200 font-medium">
                        {following.username || "Anonymous"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {following.bio || "Bio is unavailable"}
                      </p>
                    </div>
                    <Link to={`/profile/${following._id}`} className="ml-auto">
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center w-full">
                  No following yet.
                </p>
              )
            ) : (
              displayedPost.map((post) => (
                <div
                  key={post?._id}
                  className="relative border rounded-md group cursor-pointer"
                  onClick={() => handlePostClick(post)} // Handle post click
                >
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length || 0}</span>
                      </button>
                    </div>
                    <div className="flex p-3 text-justify flex-col mt-2">
                      {post.caption.substring(0, 800)}....
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;