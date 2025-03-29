import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  AtSign,
  Heart,
  MessageCircle,
  Bookmark,
  UserPlus,
  Users,
} from "lucide-react";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { toast } from "react-toastify";
import axios from "axios";
import { followingUpdate } from "@/redux/authSlice";
import { server } from "@/main";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import { setSelectedPost } from "@/redux/postSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CommentDialog from "./CommentDialog";
import Create from "./Create";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark, faLocation } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const { selectedPost } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const data = useGetSuggestedUser();
  const [matchedFollowers, setMatchedFollowers] = useState([]);
  const [matchedFollowing, setMatchedFollowing] = useState([]);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [comment, setComment] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);

  const getFileType = (url) => {
    if (!url) return "unknown";
    if (url.match(/\.(jpeg|jpg|gif|png)$/i)) return "image";
    if (url.match(/\.(mp4|mov|avi|mkv)$/i)) return "video";
    if (url.includes("raw/upload")) return "pdf";
    return "unknown";
  };

  const handlePostClick = (post) => {
    if (!post || !post.image) {
      toast.error("Invalid post data.");
      return;
    }
    setComment(post.comments);
    dispatch(setSelectedPost(post));
    setSelectedMedia(post);
    setOpenPostModal(true);
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following.includes(userProfile?._id);
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
      setTimeout(() => {
        window.location.reload();
      }, 50);
      dispatch(followingUpdate(userProfile?._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error following user");
    }
  };

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
    <div className="max-w-6xl mx-auto p-12 md:p-6 text-gray-100">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <Avatar className="h-40 w-40 md:h-48 md:w-48 border-4 border-blue-500/30 shadow-lg">
            <AvatarImage
              src={userProfile?.profilePicture}
              alt="profilephoto"
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-700 text-2xl font-bold">
              {userProfile?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {userProfile?.username}
            </h1>

            {isLoggedInUserProfile ? (
              <div className="flex gap-3">
                <Link to="/edit">
                  <Button
                    variant="outline"
                    className="bg-transparent hover:bg-gray-800 hover:text-white border-gray-700"
                  >
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  onClick={() => setOpenCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Give Advice
                </Button>
                <Create open={openCreateModal} setOpen={setOpenCreateModal} />
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={followAndUnfollowHandler}
                  className={`${
                    isFollowing
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700"
                >
                  {userRole}
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {userProfile?.posts?.length || 0}
              </span>
              <span className="text-gray-400">posts</span>
            </div>

            <Dialog
              className="text-white"
              open={openFollowersModal}
              onOpenChange={setOpenFollowersModal}
            >
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer">
                  <span className="font-semibold">
                    {userProfile?.followers?.length || 0}
                  </span>
                  <span className="text-gray-400">followers</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md text-white bg-gray-900 border-gray-800 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center text-white">
                    Followers
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {matchedFollowers.length > 0 ? (
                    matchedFollowers.map((follower) => (
                      <div
                        key={follower._id}
                        className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Link
                          to={`/profile/${follower._id}`}
                          className="flex items-center gap-4 flex-1"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={follower.profilePicture} />
                            <AvatarFallback>
                              {follower.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{follower.username}</p>
                            <p className="text-sm text-gray-400">
                              {follower.bio?.substring(0, 30)}
                            </p>
                          </div>
                        </Link>
                        {!isLoggedInUserProfile && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-auto"
                          >
                            Follow
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="mx-auto h-12 w-12 mb-2" />
                      <p>No followers yet</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              className="text-white"
              open={openFollowingModal}
              onOpenChange={setOpenFollowingModal}
            >
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer">
                  <span className="font-semibold">
                    {userProfile?.following?.length || 0}
                  </span>
                  <span className="text-gray-50">following</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-gray-900 border-gray-800 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center text-white">
                    Following
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {matchedFollowing.length > 0 ? (
                    matchedFollowing.map((following) => (
                      <div
                        key={following._id}
                        className="flex items-center text-white gap-4 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Link
                          to={`/profile/${following._id}`}
                          className="flex items-center gap-4 flex-1"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={following.profilePicture} />
                            <AvatarFallback>
                              {following.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{following.username}</p>
                            <p className="text-sm text-gray-400">
                              {following.bio?.substring(0, 30)}
                            </p>
                          </div>
                        </Link>
                        {!isLoggedInUserProfile && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-auto"
                          >
                            Follow
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="mx-auto h-12 w-12 mb-2" />
                      <p>Not following anyone yet</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-1">
              {userProfile?.email || "No name provided"}
            </h2>
            <p className="text-gray-300 mb-3">
              {userProfile?.bio || "No bio yet"}
            </p>
            <Badge variant="secondary" className="bg-gray-50 hover:bg-gray-400">
              <AtSign className="h-4 w-4 mr-1" />
              {userProfile?.username}
            </Badge>
          </div>

          <div>
            <h2 className="text-2xl mb-2 font-mono text-yellow-600 underline">Social Links</h2>
            <div className="flex gap-4 items-center">
              {userProfile?.leetcode && (
                <a
                  href={`https://leetcode.com/${userProfile.leetcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-1 rounded-full bg-white gap-1 text-black font-bold hover:underline"
                  title="LeetCode Profile"
                >
                  <img
                    src="https://leetcode.com/favicon.ico"
                    alt="LeetCode"
                    className="w-4 h-4"
                  />
                  LeetCode
                </a>
              )}
              {userProfile?.github && (
                <a
                  href={`https://github.com/${userProfile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-1 rounded-full bg-white gap-1 text-black font-bold hover:underline"
                  title="GitHub Profile"
                >
                  <img
                    src="https://github.githubassets.com/favicons/favicon.png"
                    alt="GitHub"
                    className="w-4 h-4"
                  />
                  GitHub
                </a>
              )}
              {userProfile?.linkedin && (
                <a
                  href={
                    userProfile.linkedin.startsWith("http")
                      ? userProfile.linkedin
                      : `https://linkedin.com/in/${userProfile.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-1 rounded-full bg-white gap-1 text-black font-bold  hover:underline"
                  title="LinkedIn Profile"
                >
                  <img
                    src="https://static.licdn.com/sc/h/akt4ae504epesldzj74dzred8"
                    alt="LinkedIn"
                    className="w-4 h-4"
                  />
                  LinkedIn
                </a>
              )}
              {userProfile?.twiter && (
                <a
                  href={`https://twitter.com/${userProfile.twiter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-1 rounded-full bg-white gap-1 text-black font-bold  hover:underline"
                  title="Twitter Profile"
                >
                  <img
                    src="https://abs.twimg.com/favicons/twitter.3.ico"
                    alt="Twitter"
                    className="w-4 h-4"
                  />
                  Twitter
                </a>
              )}
              {userProfile?.address && (
                <div className="flex items-center gap-1 text-gray-300">
                  <FontAwesomeIcon icon={faLandmark} className="h-4 w-4" />
                  {userProfile.address}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800 mt-8">
        <div className="flex justify-center gap-1 md:gap-8 text-gray-400">
          <button
            onClick={() => handleTabChange("posts")}
            className={`py-4 px-2 md:px-4 relative ${
              activeTab === "posts" ? "text-white" : ""
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="hidden md:inline">Posts</span>
              <span className="md:hidden">📝</span>
            </span>
            {activeTab === "posts" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                layoutId="profileTabIndicator"
              />
            )}
          </button>

          {isLoggedInUserProfile && (
            <button
              onClick={() => handleTabChange("saved")}
              className={`py-4 px-2 md:px-4 relative ${
                activeTab === "saved" ? "text-white" : ""
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="hidden md:inline">Saved</span>
                <span className="md:hidden">🔖</span>
              </span>
              {activeTab === "saved" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  layoutId="profileTabIndicator"
                />
              )}
            </button>
          )}

          <button
            onClick={() => setOpenFollowersModal(true)}
            className={`py-4 px-2 md:px-4 relative ${
              activeTab === "followers" ? "text-white" : ""
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="hidden md:inline">Followers</span>
              <span className="md:hidden">👥</span>
            </span>
          </button>

          <button
            onClick={() => setOpenFollowingModal(true)}
            className={`py-4 px-2 md:px-4 relative ${
              activeTab === "following" ? "text-white" : ""
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="hidden md:inline">Following</span>
              <span className="md:hidden">👤</span>
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "posts" || activeTab === "saved" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTab === "posts"
              ? userProfile?.posts
              : userProfile?.bookmarks
            )?.map((post) => {
              const fileType = getFileType(post?.image);
              return (
                <motion.div
                  key={post?._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  {fileType === "image" && (
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  {fileType === "video" && (
                    <video
                      src={post.image}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  {fileType === "pdf" && (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Bookmark className="h-12 w-12 mx-auto text-blue-400" />
                        <p className="mt-2 text-sm">PDF Document</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <div className="flex items-center text-white">
                      <Heart className="mr-1" />
                      <span>{post?.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <MessageCircle className="mr-1" />
                      <span>{post?.comments?.length || 0}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Post Modal */}
      <Dialog open={openPostModal} onOpenChange={setOpenPostModal}>
        <CommentDialog
          open={openPostModal}
          setOpen={setOpenPostModal}
          comments={selectedMedia?.comments || []}
        />
      </Dialog>
    </div>
  );
};

export default Profile;
