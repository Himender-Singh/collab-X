import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';

const Error = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/feed');
        }, 15000); // Increased delay to 8 seconds to appreciate the animation

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleClose = () => {
        navigate('/feed');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4"
            >
                <motion.div
                    initial={{ y: -50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-t-4 border-yellow-500"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <AiOutlineExclamationCircle className="text-yellow-600 text-4xl" />
                        </div>
                        <button 
                            onClick={handleClose} 
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            aria-label="Close error message"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-6xl font-bold text-gray-800">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
                        <p className="text-gray-600">
                            Oops! The page you're looking for doesn't exist or is under construction.
                        </p>
                        
                        <div className="pt-6">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 14.5, ease: 'linear' }}
                                className="h-1 bg-gray-200 rounded-full overflow-hidden"
                            >
                                <div className="h-full bg-yellow-500"></div>
                            </motion.div>
                            <p className="text-sm text-gray-500 mt-2">
                                Redirecting in <span className="font-medium">15 seconds</span>...
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClose}
                            className="mt-6 px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-200"
                        >
                            Go Home Now
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Error;