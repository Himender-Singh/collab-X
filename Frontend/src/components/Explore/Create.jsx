import React, { useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader2, Image, FileText, Video, File, Plus } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'react-toastify';
import { readFileAsDataURL } from "../../lib/utils.js";
import { setPosts } from '@/redux/postSlice';
import { server } from '@/main';

const Create = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState(null); // 'image', 'video', 'pdf', 'text', or 'mixed'
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const fileType = file.type;

      if (fileType.startsWith("image")) {
        const dataUrl = await readFileAsDataURL(file);
        setPreview(
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <img 
              src={dataUrl} 
              alt="preview" 
              className='object-contain w-full h-full'
            />
          </div>
        );
        setPostType('image');
      } else if (fileType.startsWith("video")) {
        const dataUrl = URL.createObjectURL(file);
        setPreview(
          <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <video controls className='w-full h-full'>
              <source src={dataUrl} type={fileType} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
        setPostType('video');
      } else if (fileType === "application/pdf") {
        const dataUrl = URL.createObjectURL(file);
        setPreview(
          <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <iframe 
              src={dataUrl} 
              className='w-full h-full'
              title="PDF Preview"
            ></iframe>
          </div>
        );
        setPostType('pdf');
      } else {
        toast.error("Unsupported file type");
        setFile(null);
        setPreview(null);
        setPostType(null);
      }
    }
  };

  const createPostHandler = async () => {
    if (!caption.trim() && !file) {
      toast.error("Please add content to your post");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("file", file);
    formData.append("postType", postType || (caption ? 'text' : 'unknown'));

    try {
      setLoading(true);
      const res = await axios.post(`${server}/post/addpost`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCaption("");
    setPreview(null);
    setPostType(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className='text-center font-semibold text-lg'>Create New Post</DialogHeader>
        
        {/* User Info */}
        <div className='flex gap-3 items-center p-3 border-b dark:border-gray-700'>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profilePicture || "/default-avatar.jpg"} alt="profile" />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-sm'>{user?.username}</h1>
            <span className='text-gray-500 dark:text-gray-400 text-xs'>{user?.bio}</span>
          </div>
        </div>

        {/* Post Type Selector */}
        {!preview && (
          <div className="flex justify-center gap-4 p-4">
            <button 
              onClick={() => imageRef.current.click()}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Image className="h-6 w-6 text-blue-500" />
              <span className="text-xs">Image</span>
            </button>
            <button 
              onClick={() => imageRef.current.click()}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Video className="h-6 w-6 text-red-500" />
              <span className="text-xs">Video</span>
            </button>
            <button 
              onClick={() => imageRef.current.click()}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <File className="h-6 w-6 text-yellow-500" />
              <span className="text-xs">PDF</span>
            </button>
            <button 
              onClick={() => setPostType('text')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FileText className="h-6 w-6 text-green-500" />
              <span className="text-xs">Text</span>
            </button>
          </div>
        )}

        {/* Caption Input */}
        <div className="p-3">
          <Textarea 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            className="focus-visible:ring-0 focus-visible:ring-offset-0 border min-h-[100px] text-sm"
            placeholder={postType === 'text' ? "Write your post..." : "Add a caption..."}
          />
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="p-3">
            {preview}
            <button 
              onClick={() => {
                setFile(null);
                setPreview(null);
                setPostType(null);
              }}
              className="mt-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              Remove media
            </button>
          </div>
        )}

        {/* File Input (hidden) */}
        <input 
          ref={imageRef} 
          type='file' 
          className='hidden' 
          onChange={fileChangeHandler} 
          accept="image/*,video/*,application/pdf" 
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 p-3 border-t dark:border-gray-700">
          {!preview && postType !== 'text' && (
            <Button 
              variant="outline"
              onClick={() => imageRef.current.click()}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Media
            </Button>
          )}
          
          {loading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Posting...
            </Button>
          ) : (
            <Button 
              onClick={createPostHandler} 
              disabled={!caption.trim() && !file}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Create;