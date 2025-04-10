import React, { useState, useEffect } from "react";
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
  Mail,
  ChevronLeft,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";

const InterviewMode = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const data = useGetSuggestedUser();

  const [matchedFollowers, setMatchedFollowers] = useState([]);
  const [matchedFollowing, setMatchedFollowing] = useState([]);

  useEffect(() => {
    if (data?.suggestedUsers && user?.followers) {
      const matched = user.followers.map((followerId) => {
        const matchedUser = data.suggestedUsers.find((u) => u._id === followerId);
        return matchedUser
          ? {
              username: matchedUser.username,
              profilePicture: matchedUser.profilePicture,
              bio: matchedUser.bio,
              _id: matchedUser._id,
              name: matchedUser.name || matchedUser.username || "User"
            }
          : null;
      });
      setMatchedFollowers(matched.filter(Boolean));
    }
  }, [data, user?.followers]);

  useEffect(() => {
    if (data?.suggestedUsers && user?.following) {
      const matched = user.following.map((followingId) => {
        const matchedUser = data.suggestedUsers.find((u) => u._id === followingId);
        return matchedUser
          ? {
              username: matchedUser.username,
              profilePicture: matchedUser.profilePicture,
              bio: matchedUser.bio,
              _id: matchedUser._id,
              name: matchedUser.name || matchedUser.username || "User"
            }
          : null;
      });
      setMatchedFollowing(matched.filter(Boolean));
    }
  }, [data, user?.following]);

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
    if (mode.name === "Practice with a friend") {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedFriend(null);
    } else if (step === 2) {
      setStep(1);
    } else {
      onClose();
    }
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSubmit = () => {
    if (!selectedType || !selectedMode) {
      setError("Please complete all selections");
      return;
    }

    if (selectedMode === "Practice with a friend" && !selectedFriend) {
      setError("Please select a friend to practice with");
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
          practiceMode: selectedMode,
          ...(selectedFriend && { friend: selectedFriend })
        });
      }

      setIsSubmitting(false);
      setSelectedType("");
      setSelectedMode("");
      setSelectedFriend(null);
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
        className="bg-[#1c1c1c] text-white rounded-2xl p-6 w-11/12 max-w-4xl shadow-lg"
      >
        {/* Header and progress bar */}
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="mr-4 p-1 hover:bg-gray-700 rounded-full">
            {step === 1 ? <X size={20} /> : <ChevronLeft size={20} />}
          </button>
          <h2 className="text-2xl font-bold flex-1">
            {step === 1
              ? "Select your interview type"
              : step === 2
              ? "Select your practice type"
              : "Select a friend to practice with"}
          </h2>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 w-8 rounded-full ${step >= s ? "bg-blue-500" : "bg-gray-600"}`} />
            ))}
          </div>
        </div>

        {/* Step 1: Interview Type Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {interviewTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => handleTypeSelect(type.name)}
                className={`flex items-start gap-3 p-3 border rounded-xl shadow-sm
                ${selectedType === type.name ? "border-blue-500 bg-blue-700" : "hover:bg-gray-800"}`}
              >
                <div className="mt-1">{type.icon}</div>
                <div className="text-left flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {type.name}
                    {type.beta && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">Beta</span>}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{type.description}</div>
                </div>
                {selectedType === type.name && <CheckCircle className="text-blue-400" />}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Practice Mode Selection */}
        {step === 2 && (
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
              {interviewModes.map((mode) => (
                <button
                  key={mode.name}
                  onClick={() => handleModeSelect(mode)}
                  className={`flex items-start gap-3 w-full p-3 border rounded-xl shadow-sm text-left
                    ${selectedMode === mode.name ? "border-blue-500 bg-blue-700" : "hover:bg-gray-800"}
                    ${mode.premium ? "border-yellow-500" : ""}`}
                >
                  <div className="mt-1">{mode.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {mode.name}
                      {mode.premium && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">Premium</span>}
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

        {/* Step 3: Select Friend */}
        {step === 3 && (
          <div className="mb-6">
            <h2>All Your friends are here</h2>
            {["Followers", "Following"].map((group, i) => {
              const list = group === "Followers" ? matchedFollowers : matchedFollowing;
              return (
                <div key={i} className="mb-4">
                  {list.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                      {list.map((friend) => (
                        <button
                          key={friend._id}
                          onClick={() => handleFriendSelect(friend)}
                          className={`flex items-center gap-3 p-3 border rounded-xl shadow-sm text-left
                            ${selectedFriend?._id === friend._id ? "border-blue-500 bg-blue-700" : "hover:bg-gray-700"}`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                            {friend.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{friend.name}</div>
                            <div className="text-sm text-gray-300">@{friend.username}</div>
                          </div>
                          {selectedFriend?._id === friend._id && <CheckCircle className="text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-4">
                      You don’t have any {group.toLowerCase()} yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error + Buttons */}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {(step === 2 || step === 3) && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (step === 3 && !selectedFriend)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2
                ${step === 3 && !selectedFriend ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={["fas", "spinner"]} spin className="text-white" />
                  Starting...
                </>
              ) : (
                step === 3 ? "Invite Friend" : "Start Practice"
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewMode;
