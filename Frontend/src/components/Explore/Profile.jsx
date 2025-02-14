import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { toast } from 'react-toastify';
import axios from 'axios';
import { followingUpdate } from '@/redux/authSlice';
import { server } from '@/main';

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);  // Fetch user profile based on userId
    const [activeTab, setActiveTab] = useState('posts');
    const { userProfile, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    console.log(userProfile);

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
            const res = await axios.post(`${server}/user/followorunfollow/${userProfile?._id}`, { userId: user?._id });
            dispatch(followingUpdate(userProfile?._id)); // Update the following state in Redux
            toast.success(res.data.message);
        } catch (error) {
            console.error('Error following/unfollowing:', error.response);
            toast.error(error.response.data.message);
        }
    };
    
    // Determine which posts to display based on the active tab
    const displayedPost = activeTab === 'posts' ? userProfile?.posts || [] : userProfile?.bookmarks || [];

    return (
        <div className='flex flex-col sm:flex-row sm:max-w-5xl justify-center mx-auto p-5 md:p-8 lg:p-10 bg-gray-900 text-gray-100'>
            <div className='flex flex-col gap-10 sm:gap-20 p-5 sm:p-10 w-full'>
                <div className='flex flex-col sm:flex-row sm:gap-10'>
                    <section className='flex justify-center sm:w-1/3'>
                        <Avatar className='h-32 w-32 shadow-lg'>
                            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </section>
                    <section className='flex flex-col gap-5 sm:w-2/3'>
                        <div className='flex'>
                            <span className='text-xl mt-5 sm:text-2xl mr-4 font-semibold'>{userProfile?.username}</span>
                            {isLoggedInUserProfile ? (
                                <div className='flex sm:gap-2 mt-5 gap-5'>
                                    <Link to="/edit">
                                        <Button variant='secondary' className='hover:bg-gray-700 hover:text-white h-8 sm:h-10 text-sm sm:text-base'>Edit Profile</Button>
                                    </Link>
                                    <div className='hidden sm:flex gap-2'>
                                        <Button variant='secondary' className='hover:bg-gray-700 hover:text-white h-8 sm:h-10 text-sm sm:text-base'>View Archive</Button>
                                        <Button variant='secondary' className='hover:bg-gray-700 hover:text-white  h-8 sm:h-10 text-sm sm:text-base'>Ad Tools</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex gap-2 mt-5 sm:gap-5'>
                                    <Button onClick={followAndUnfollowHandler} className={`h-8 sm:h-10 text-sm sm:text-base ${isFollowing ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </Button>
                                    <Button variant='secondary' className='h-8 sm:h-10 text-sm sm:text-base'>{userRole}</Button>
                                </div>
                            )}
                        </div>
                        <div className='flex items-center gap-4 text-gray-400'>
                            <p><span className='font-semibold text-gray-100'>{userProfile?.posts?.length || 0}</span> posts</p>
                            <p><span className='font-semibold text-gray-100'>{userProfile?.followers?.length || 0}</span> followers</p>
                            <p><span className='font-semibold text-gray-100'>{userProfile?.following?.length || 0}</span> following</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <span className='font-semibold text-gray-200'>{userProfile?.bio || 'bio here...'}</span>
                            <Badge className='w-fit bg-gray-700 hover:bg-white hover:text-gray-700 text-gray-300'>
                                <AtSign /> <span className='pl-1'>{userProfile?.username}</span>
                            </Badge>
                            <span>🤯 Learn code with patel mernstack style</span>
                            <span>🤯 Turning code into fun</span>
                            <span>🤯 DM for collaboration</span>
                        </div>
                    </section>
                </div>
                <div className='border-t border-t-gray-700 mt-4'>
                    <div className='flex justify-center gap-10 text-sm sm:text-base text-gray-300'>
                        <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold text-gray-100' : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
                        <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold text-gray-100' : ''}`} onClick={() => handleTabChange('saved')}>SAVED</span>
                        <span className='py-3 cursor-pointer'>REELS</span>
                        <span className='py-3 cursor-pointer'>TAGS</span>
                    </div>
                    <div className='grid sm:grid-cols-3 grid-cols-2 gap-4'>
                        {displayedPost?.map((post) => (
                            <div key={post?._id} className='relative group cursor-pointer'>
                                <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <div className='flex items-center text-white space-x-4'>
                                        <button className='flex items-center gap-2 hover:text-gray-300'>
                                            <Heart />
                                            <span>{post?.likes?.length || 0}</span>
                                        </button>
                                        <button className='flex items-center gap-2 hover:text-gray-300'>
                                            <MessageCircle />
                                            <span>{post?.comments?.length || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
