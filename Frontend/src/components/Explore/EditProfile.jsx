import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setAuthUser } from "../../redux/authSlice";
import { server } from "@/main";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture || "",
    bio: user?.bio || "",
    gender: user?.gender || "male",
    experience: user?.experience || "",
    skills: user?.skills || "",
    role: user?.role || "student",
    sessions: user?.sessions,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setInput({
        profilePhoto: user.profilePicture || "",
        bio: user.bio || "",
        gender: user.gender || "male",
        experience: user.experience || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
        role: user.role || "student",
        sessions: user.sessions || 0,
      });
    }
  }, [user]);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("experience", input.experience);
    formData.append(
      "skills",
      input.skills.split(",").map((skill) => skill.trim())
    );
    formData.append("role", input.role);
    formData.append("sessions", input.sessions);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${server}/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
          experience: res.data.user?.experience,
          skills: res.data.user?.skills,
          role: res.data.user?.role,
          sessions: res.data.user?.sessions,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    toast.error("You need to log in first.");
    navigate("/login");
    return null;
  }

  return (
    <div className="flex text-white max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg shadow-lg my-8">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-3xl text-center mb-6 text-blue-400">Edit Profile</h1>
        
        {/* Profile Picture Section */}
        <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative rounded-full overflow-hidden w-20 h-20 border-2 border-blue-500">
              <img
                src={
                  input.profilePhoto instanceof File
                    ? URL.createObjectURL(input.profilePhoto)
                    : user?.profilePicture || "/default-avatar.png"
                }
                alt="profile_image"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">{user?.username}</h1>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user?.role === "counselor" 
                  ? "bg-purple-600 text-white" 
                  : "bg-green-600 text-white"
              }`}>
                {user?.role || "student"}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => imageRef?.current.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCamera} />
            Change
          </button>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h1 className="font-bold text-xl mb-3 text-blue-400">Bio</h1>
          <textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            placeholder="Tell us about yourself..."
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
          />
        </div>

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h1 className="font-bold text-xl mb-3 text-blue-400">Gender</h1>
            <select
              value={input.gender}
              onChange={(e) => selectChangeHandler(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Role */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h1 className="font-bold text-xl mb-3 text-blue-400">Role</h1>
            <select
              value={input.role}
              onChange={(e) => setInput({ ...input, role: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>
            </select>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h1 className="font-bold text-xl mb-3 text-blue-400">Professional Information</h1>
          
          {/* Experience */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Experience</label>
            <input
              type="text"
              value={input.experience}
              onChange={(e) => setInput({ ...input, experience: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your professional experience"
            />
          </div>

          {/* Skills */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Skills</label>
            <input
              type="text"
              value={input.skills}
              onChange={(e) => setInput({ ...input, skills: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma-separated skills (e.g., React, Counseling, Psychology)"
            />
            <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
          </div>

          {/* Sessions (for counselors) */}
          {input.role === "counselor" && (
            <div>
              <label className="block text-gray-300 mb-2">Sessions Conducted</label>
              <input
                type="number"
                value={input.sessions}
                onChange={(e) => setInput({ ...input, sessions: e.target.value })}
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of sessions conducted"
                min="0"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          {loading ? (
            <button 
              disabled
              className="bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center gap-2 opacity-75"
            >
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Saving...
            </button>
          ) : (
            <button
              onClick={editProfileHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all"
            >
              Save Changes
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;