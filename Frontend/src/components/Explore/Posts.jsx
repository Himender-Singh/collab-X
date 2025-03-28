import React, { Suspense, lazy } from "react";
import useGetAllPost from "@/hooks/useGetAllPost";
import { useSelector } from "react-redux";
import Post from "./Post";
import { Link, useNavigate } from "react-router-dom";
import PostCreate from "./PostCreate";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

const Posts = () => {
  const navigate = useNavigate();
  const { loading, error } = useGetAllPost();
  const posts = useSelector((store) => store.post.posts) || [];

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <FiLoader className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-500 text-lg">Error: {error}</p>
    </div>
  );

  if (posts.length === 0) {
    navigate("/login");
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No posts available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <PostCreate />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 px-4"
      >
        {posts.slice().map((post) => (
          <Suspense
            key={post._id}
            fallback={
              <div className="bg-gray-800 rounded-xl p-4 h-64 animate-pulse"></div>
            }
          >
            <Post post={post} />
          </Suspense>
        ))}
      </motion.div>
    </div>
  );
};

export default Posts;