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
    <div className="flex text-white max-w-2xl mx-auto p-4 bg-black rounded-lg shadow-lg">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-2xl text-center">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden w-16 h-16">
              <img
                src={
                  input.profilePhoto instanceof File
                    ? URL.createObjectURL(input.profilePhoto)
                    : user?.profilePicture
                }
                alt="profile_image"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white pb-2">{user?.username}</h1>
              <span className="text-black font-semibold p-1 rounded bg-white">
                {user?.role || "student..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <button
            onClick={() => imageRef?.current.click()}
            className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-500 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCamera} />
            Change photo
          </button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            placeholder="Bio here..."
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Gender</h1>
          <select
            value={input.gender}
            onChange={(e) => selectChangeHandler(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Experience</h1>
          <input
            type="text"
            value={input.experience}
            onChange={(e) => setInput({ ...input, experience: e.target.value })}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your experience"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Skills</h1>
          <input
            type="text"
            value={input.skills}
            onChange={(e) => setInput({ ...input, skills: e.target.value })}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Comma-separated skills"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Role</h1>
          <select
            value={input.role}
            onChange={(e) => setInput({ ...input, role: e.target.value })}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="student">Student</option>
            <option value="counselor">Counselor</option>
          </select>
        </div>
        {input.role === "counselor" && (
          <div>
            <h1 className="font-bold text-xl mb-2">Sessions</h1>
            <input
              type="number"
              value={input.sessions}
              onChange={(e) => setInput({ ...input, sessions: e.target.value })}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Number of sessions"
            />
          </div>
        )}
        <div className="flex justify-end">
          {loading ? (
            <button className="w-fit bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-500 flex items-center gap-2">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Please wait
            </button>
          ) : (
            <button
              onClick={editProfileHandler}
              className="w-fit bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-500"
            >
              Submit
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
