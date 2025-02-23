import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div
        className="bg-black bg-opacity-60 backdrop-blur-sm absolute inset-0 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-gray-900 text-white rounded-2xl p-6 z-10 w-96 shadow-xl relative"
      >
        <h2 className="text-xl font-bold text-center mb-2">Notification</h2>
        <p className="text-gray-300 text-center">
          🚧 Currently! We are not available. Please check back later.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/feed">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 transition-all px-4 py-2 text-white font-semibold rounded-lg shadow-md"
            >
              Navigate me to Feed
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
