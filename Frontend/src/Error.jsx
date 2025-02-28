import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai'; // Importing close icon
import { AiOutlineExclamationCircle } from 'react-icons/ai'; // Importing open icon

const Error = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home page after a delay
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000); // Redirects after 5 seconds

        // Cleanup the timer
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleClose = () => {
        navigate('/'); // Close button redirects to home
    };

    return (
        <div className="flex relative items-center justify-center h-screen bg-opacity-50">
            <div className="bg-white absolute rounded-lg shadow-lg p-8 max-w-md text-center">
                <div className="flex justify-between items-center">
                    <div className="text-yellow-500 text-3xl">
                        <AiOutlineExclamationCircle />
                    </div>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <h1 className="text-4xl font-bold mt-4">404</h1>
                <p className="text-gray-700 mt-2">Page Not Found</p>
                <p className="text-gray-500 mt-2">You will be redirected to the home page shortly.</p>
            </div>
        </div>
    );
};

export default Error;
