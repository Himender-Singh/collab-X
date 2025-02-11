// components/Modal.js
import React from "react";
import { Link } from "react-router-dom";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-black bg-opacity-50 absolute inset-0"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-6 z-10">
        <h2 className="text-lg font-bold">Notification</h2>
        <p>No sessions scheduled</p>
        <Link to={"/feed"}>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Modal;
