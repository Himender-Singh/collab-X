import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const InterviewMode = ({ isOpen, onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interviewTypes = [
    "Data Structures & Algorithms (DSA)",
    "System Design",
    "Behavioral Interview",
    "Full-stack Development Questions",
    "Company-specific Mock Interviews (Google, Amazon, etc.)",
  ];

  const interviewModes = [
    "Self-practice mode – AI evaluation.",
    "Peer-to-peer mode – Real-time mock interview.",
  ];

  const handleSubmit = () => {
    if (!selectedType || !selectedMode) {
      setError("Please select both an interview type and mode.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({ selectedType, selectedMode });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-11/12 max-w-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Interview Options</h2>

        {/* Interview Type Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-700">Interview Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
            {interviewTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => setSelectedType(type)}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-200 text-gray-700 shadow-sm 
                  ${selectedType === type ? "border-blue-500 bg-blue-100" : "hover:bg-gray-100"}`}
              >
                {type}
                {selectedType === type && <CheckCircle className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Mode Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-700">Interview Mode</h3>
          <div className="space-y-2 gap-3">
            {interviewModes.map((mode, index) => (
              <button
                key={index}
                onClick={() => setSelectedMode(mode)}
                className={`flex items-center justify-between w-full p-3 border rounded-xl transition-all duration-200 text-gray-700 shadow-sm 
                  ${selectedMode === mode ? "border-blue-500 bg-blue-100" : "hover:bg-gray-100"}`}
              >
                {mode}
                {selectedMode === mode && <CheckCircle className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewMode;