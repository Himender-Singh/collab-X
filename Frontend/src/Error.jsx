import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from "./assets/a1.svg"

const Error = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <img src={img} alt="Error" className="w-1/2 mb-8" /> {/* Error image */}
            <div className="text-center">
                <h1 className="text-9xl font-bold text-red-500">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-white">Page Not Found</h2>
                <p className="mt-2 text-gray-400">The page you are looking for does not exist.</p>
                <button
                    onClick={goToHome}
                    className="mt-6 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
};

export default Error;
