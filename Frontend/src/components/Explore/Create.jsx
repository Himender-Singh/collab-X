import React, { useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
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
        setPreview(<img src={dataUrl} alt="preview" className='object-cover h-full w-full rounded-md' />);
      } else if (fileType.startsWith("video")) {
        const dataUrl = URL.createObjectURL(file);
        setPreview(<video controls className='w-full h-64 rounded-md'><source src={dataUrl} type={fileType} /></video>);
      } else if (fileType === "application/pdf") {
        const dataUrl = URL.createObjectURL(file);
        setPreview(<iframe src={dataUrl} className='w-full h-64 rounded-md'></iframe>);
      } else {
        toast.error("Unsupported file type");
        setFile(null);
        setPreview(null);
      }
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(`${server}/post/addpost`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        window.location.reload();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture || "/default-avatar.jpg"} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>{user?.bio}</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Share your thoughts..." />
        {preview && <div className='w-full h-64 flex items-center justify-center'>{preview}</div>}
        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} accept="image/*,video/*,application/pdf" />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>Select from computer</Button>
        {loading ? (
          <Button disabled>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        ) : (
          <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Create;