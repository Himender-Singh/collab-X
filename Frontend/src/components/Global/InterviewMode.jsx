import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterviewMode = ({ isOpen, onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const interviewTypes = [
    "Data Structures & Algorithms (DSA)",
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
      if (
        selectedType === "Data Structures & Algorithms (DSA)" &&
        selectedMode === "Self-practice mode – AI evaluation."
      ) {
        navigate("/code-editor");
      } else if (
        selectedType === "Company-specific Mock Interviews (Google, Amazon, etc.)" &&
        selectedMode === "Self-practice mode – AI evaluation."
      ) {
        navigate("/dsa-sheet-code-editor");
      } else {
        onSubmit({ selectedType, selectedMode });
      }
      setIsSubmitting(false);
      setSelectedType("");
      setSelectedMode("");
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1c1c1c] text-white rounded-2xl p-6 w-11/12 max-w-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6">Select Interview Options</h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Interview Type</h3>
          <div className="grid grid-cols-1 gap-3">
            {interviewTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => setSelectedType(type)}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-200 shadow-sm 
                  ${selectedType === type ? "border-blue-500 bg-blue-700" : "hover:bg-gray-800"}`}
              >
                {type}
                {selectedType === type && <CheckCircle className="text-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Interview Mode</h3>
          <div className="space-y-2">
            {interviewModes.map((mode, index) => (
              <button
                key={index}
                onClick={() => setSelectedMode(mode)}
                className={`flex items-center justify-between w-full p-3 border rounded-xl transition-all duration-200 shadow-sm 
                  ${selectedMode === mode ? "border-blue-500 bg-blue-700" : "hover:bg-gray-800"}`}
              >
                {mode}
                {selectedMode === mode && <CheckCircle className="text-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-700 border border-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-50 text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewMode;
