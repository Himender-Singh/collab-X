import React, { Suspense, lazy } from 'react';
import useGetAllPost from '@/hooks/useGetAllPost';
import { useSelector } from 'react-redux';
import Post from './Post';

const Posts = () => {
  // Call the custom hook to fetch posts
  const { loading, error } = useGetAllPost();
  const posts = useSelector(store => store.post.posts) || []; 
  
  if (loading) return <p className="text-center">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No posts available.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      {posts.slice().map((post) => (
        <Suspense key={post._id} fallback={<p className="text-center">Loading post...</p>}>
          <Post post={post} />
        </Suspense>
      ))}
    </div>
  );
};

export default Posts;
