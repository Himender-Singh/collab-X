import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Lock, 
  Box, 
  Code, 
  Network, 
  User, 
  Database, 
  BarChart2, 
  Layout,
  Users,
  Star,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InterviewMode = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1); // 1: Select type, 2: Select mode
  const [selectedType, setSelectedType] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const interviewTypes = [
    {
      name: "Product Management",
      description: "Practice product sense, estimation",
      icon: <Box className="text-blue-400" size={20} />,
      beta: false
    },
    {
      name: "Data Structures & Algorithms",
      description: "Practice coding questions",
      icon: <Code className="text-green-400" size={20} />,
      beta: false
    },
    {
      name: "System Design",
      description: "Design technical architectures",
      icon: <Network className="text-purple-400" size={20} />,
      beta: false
    },
    {
      name: "Behavioral",
      description: "Work experience questions",
      icon: <User className="text-yellow-400" size={20} />,
      beta: false
    },
    {
      name: "SQL",
      description: "Writing SQL queries",
      icon: <Database className="text-red-400" size={20} />,
      beta: true
    },
    {
      name: "Data Science & ML",
      description: "Data analysis and systems",
      icon: <BarChart2 className="text-pink-400" size={20} />,
      beta: true
    },
    {
      name: "Frontend",
      description: "JavaScript exercises",
      icon: <Layout className="text-orange-400" size={20} />,
      beta: true
    },
    {
      name: "Backend",
      description: "System design and coding",
      icon: <Layout className="text-orange-400" size={20} />,
      beta: true
    }
  ];

  const interviewModes = [
    { 
      name: "Practice with peers",
      description: "Mock interviews with other users",
      icon: <Users className="text-blue-400" size={20} />,
      premium: false 
    },
    { 
      name: "Expert mock interview",
      description: "1-1 with FAANG+ experts",
      icon: <Star className="text-yellow-400" size={20} />,
      premium: true
    },
    { 
      name: "Practice with a friend", 
      description: "Invite a friend to practice",
      icon: <Mail className="text-green-400" size={20} />,
      premium: false
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleModeSelect = (mode) => {
    if (mode.premium) {
      navigate("/premium");
      return;
    }
    setSelectedMode(mode.name);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!selectedType || !selectedMode) {
      setError("Please complete all selections");
      return;
    }
    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedType.includes("Data Structures & Algorithms") && selectedMode === "Practice with peers") {
        navigate("/dsa-peer-practice");
      } else if (selectedType.includes("Behavioral") && selectedMode === "Expert mock interview") {
        navigate("/premium");
      } else {
        onSubmit({ 
          interviewType: selectedType, 
          practiceMode: selectedMode 
        });
      }
      setIsSubmitting(false);
      setSelectedType("");
      setSelectedMode("");
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1c1c1c] text-white rounded-2xl p-6 w-11/12 max-w-4xl shadow-lg" // Increased max width
      >
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold flex-1">
            {step === 1 ? "Select your interview type" : "Select your practice type"}
          </h2>
          <div className="flex gap-1">
            <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-gray-600"}`}></div>
            <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-gray-600"}`}></div>
          </div>
        </div>

        {step === 1 ? (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* Two-column layout */}
              {interviewTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => handleTypeSelect(type.name)}
                  className={`flex items-start gap-3 p-3 border rounded-xl transition-all duration-200 shadow-sm 
                    ${selectedType === type.name ? "border-blue-500 bg-blue-700" : "hover:bg-gray-800"}`}
                >
                  <div className="mt-1">
                    {type.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {type.name}
                      {type.beta && (
                        <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">Beta</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">{type.description}</div>
                  </div>
                  {selectedType === type.name && <CheckCircle className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-gray-800 rounded-lg p-3 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                {interviewTypes.find(t => t.name === selectedType)?.icon}
              </div>
              <div>
                <div className="text-sm text-gray-400">Selected interview type</div>
                <div className="font-medium">{selectedType}</div>
              </div>
            </div>

            <div className="space-y-3">
              {interviewModes.map((mode, index) => (
                <button
                  key={index}
                  onClick={() => handleModeSelect(mode)}
                  className={`flex items-start gap-3 w-full p-3 border rounded-xl transition-all duration-200 shadow-sm text-left
                    ${selectedMode === mode.name ? "border-blue-500 bg-blue-700" : "hover:bg-gray-800"}
                    ${mode.premium ? "border-yellow-500" : ""}`}
                >
                  <div className="mt-1">
                    {mode.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {mode.name}
                      {mode.premium && (
                        <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">Premium</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">{mode.description}</div>
                  </div>
                  {mode.premium ? (
                    <Lock className="text-yellow-400" size={18} />
                  ) : (
                    selectedMode === mode.name && <CheckCircle className="text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedMode}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2
                ${!selectedMode ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={["fas", "spinner"]} spin className="text-white" />
                  Starting...
                </>
              ) : (
                "Start Practice"
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewMode;