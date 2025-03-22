import React, { Suspense, lazy } from "react";
import useGetAllPost from "@/hooks/useGetAllPost";
import { useSelector } from "react-redux";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import PostCreate from "./PostCreate";

const Posts = () => {
  // Call the custom hook to fetch posts
  const navigate = useNavigate();
  const { loading, error } = useGetAllPost();
  const posts = useSelector((store) => store.post.posts) || [];

  if (loading) return <p className="text-center">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (posts.length === 0) {
    navigate("/login");
    return <p className="text-center text-gray-500">No posts available.</p>;
  }

  return (
    <div className="relative">
      <div className="bg-black/50 h-12 z-50 top-0 fixed w-full backdrop-blur-xl">
        {/* Content inside the fixed header */}
      </div>
      <PostCreate/>
      <div className="p-6 space-y-4">
        {posts.slice().map((post) => (
          <Suspense
            key={post._id}
            fallback={<p className="text-center">Loading post...</p>}
          >
            <Post post={post} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Posts;
