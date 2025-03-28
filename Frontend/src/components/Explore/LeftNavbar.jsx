import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiSearch, 
  FiEdit, 
  FiUser, 
  FiMessageSquare, 
  FiLogOut,
  FiPlusSquare,
  FiHelpCircle,
  FiAward,
  FiZap
} from "react-icons/fi";
import { 
  RiCodeSSlashLine,
  RiBrainLine,
  RiStickyNoteLine,
  RiLightbulbFlashLine
} from "react-icons/ri";
import { 
  HiOutlineCollection,
  HiOutlinePlay
} from "react-icons/hi";
import { 
  FaWpexplorer 
} from "react-icons/fa";
import { 
  AiOutlineMenu, 
  AiOutlineClose 
} from "react-icons/ai";
import logo from "../../assets/logo.png";
import Create from "./Create";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { server } from "@/main";
import InterviewMode from "../Global/InterviewMode";

const LeftNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const hiddenRoutes = ["/login", "/signup"];

  const navLinks = [
    { to: "/feed", icon: <FiHome size={18} />, label: "Feed" },
    { to: "/search", icon: <FiSearch size={18} />, label: "Search" },
    { to: "/dsa-sheet-code-editor", icon: <HiOutlineCollection size={18} />, label: "DSA Sheet" },
    { to: "/code-editor", icon: <RiCodeSSlashLine size={18} />, label: "Compiler" },
    { to: "/playground", icon: <HiOutlinePlay size={18} />, label: "Playground" },
    { to: "/session", icon: <RiStickyNoteLine size={18} />, label: "Notes" },
    { to: "/chat", icon: <FiMessageSquare size={18} />, label: "Messages" },
    { to: user ? `/profile/${user._id}` : "#", icon: <FiUser size={18} />, label: "Profile" },
    { to: "/edit", icon: <FiEdit size={18} />, label: "Edit" },
    { to: "/need-help", icon: <FiHelpCircle size={18} />, label: "Help" },
    { to: "/premium", icon: <FiAward size={18} />, label: "Premium" },
    { to: "/startups-idea", icon: <RiLightbulbFlashLine size={18} />, label: "Startups" },
  ];

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout());
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleLinkClick = (to) => {
    if (to === "/code-editor") {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 right-4 text-white z-[1000] bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </button>

      <div
        className={`fixed border-r z-50 border-gray-800 top-0 left-0 h-screen w-64 bg-[#18181b] p-4 font-inter text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block`}
      >
        <Link to={"/feed"} className="block mb-2">
          <div className="flex items-center space-x-3 px-2 py-2">
            <img src={logo} alt="Logo" className="w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">CollabX</span>
          </div>
        </Link>

        <div className="h-[calc(100vh-180px)] flex flex-col justify-between">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? "bg-gray-700 text-blue-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => handleLinkClick(to)}
              >
                <span className="text-gray-400 group-hover:text-white">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              <FaWpexplorer size={16} className="text-gray-400" />
              <span>Mock Interview</span>
            </button>
            
            <Link
              to="/collabx-ai-chatbot"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === "/collabx-ai-chatbot"
                  ? "bg-gray-700 text-blue-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <RiBrainLine size={18} className="text-gray-400" />
              <span>AI ChatBot</span>
            </Link>
            
            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              <FiPlusSquare size={18} className="text-gray-400" />
              <span>Create</span>
            </button>
          </nav>

          <div className="mt-auto">
            <button
              onClick={logoutHandler}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-red-300 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <Create open={openCreateModal} setOpen={setOpenCreateModal} />
      </div>

      <InterviewMode isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default LeftNavbar;