import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faSearch,
  faComments,
  faSignOutAlt,
  faSquarePlus,
  faUser,
  faEdit,
  faCode,
  faSheetPlastic,
  faHome,
  faBrain,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";
import Create from "./Create";
import Modal from "./Modal";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { server } from "@/main";
import { VscRemoteExplorer } from "react-icons/vsc";
import { faWpexplorer } from "@fortawesome/free-brands-svg-icons";
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
    { to: "/feed", icon: faHome, label: "Feed" },
    { to: "/search", icon: faSearch, label: "Search" },
    { to: "/dsa-sheet-code-editor", icon: faSheetPlastic, label: "DSA Sheet" },
    { to: "/code-editor", icon: faCode, label: "Compiler" },
    { to: "/chat", icon: faMessage, label: "Message" },
    { to: user ? `/profile/${user._id}` : "#", icon: faUser, label: "Profile" },
    { to: "/edit", icon: faEdit, label: "Edit" },
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

  const handleInboxClick = () => {
    setIsModalOpen(true);
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Hide the navbar
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 right-4 text-white z-[1000]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-6 h-6" />
      </button>

      <div
        className={`fixed border-r-2 z-50 border-gray-900 overflow-y-auto top-0 left-0 h-screen w-80 bg-[#131313] p-5 font-poppins text-white shadow-md shadow-gray-800 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block`}
      >
        <Link to={"/feed"}>
          <div className="mb-4 flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-12" />
            <span className="text-xl font-semibold">CollabX</span>
          </div>
        </Link>

        <nav className="flex flex-col space-y-4">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-3 hover:bg-blue-600 hover:rounded-md p-2 transition-all duration-200 ${
                location.pathname === to
                  ? "bg-blue-600 rounded-md" // Active tab style
                  : ""
              }`}
              onClick={() => {
                handleLinkClick(); // Close navbar when clicking link
                if (to === "/inbox") handleInboxClick();
              }}
            >
              <FontAwesomeIcon icon={icon} className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-3 hover:bg-blue-600 hover:rounded-md p-2 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faWpexplorer} className="w-5 h-5" />
            <span>Mock Interview</span>
          </button>
          <Link
            to="/collabx-ai-chatbot"
            className={`flex items-center space-x-3 hover:bg-blue-600 hover:rounded-md p-2 transition-all duration-200 ${
              location.pathname === "/collabx-ai-chatbot"
                ? "bg-blue-600 rounded-md" // Active tab style
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faBrain} className="w-5 h-5" />
            <span>AI ChatBot</span>
          </Link>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center space-x-3 hover:bg-blue-600 hover:rounded-md p-2 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSquarePlus} className="w-5 h-5" />
            <span>Create</span>
          </button>
        </nav>

        <div className="mt-8 flex flex-col space-y-3">
          <button
            onClick={logoutHandler}
            className="flex items-center space-x-3 bg-red-600 px-3 py-2 rounded-md hover:bg-red-700 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <Create open={openCreateModal} setOpen={setOpenCreateModal} />
      </div>

      {/* Modal for no sessions scheduled */}
      <InterviewMode isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default LeftNavbar;