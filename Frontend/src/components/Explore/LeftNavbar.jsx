import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faSearch,
  faUsers,
  faQuestionCircle,
  faEnvelope,
  faClipboardList,
  faComments,
  faBookmark,
  faSignOutAlt,
  faSquarePlus,
  faUser,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import Create from './Create';
import Modal from './Modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { server } from '@/main';

const LeftNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const hiddenRoutes = ['/login', '/signup'];

  const navLinks = [
    { to: '/feed', icon: faClipboardList, label: 'Feed' },
    { to: '/search', icon: faSearch, label: 'Search' },
    { to: '/mentors', icon: faUsers, label: 'Mentors' },
    { to: user ? `/profile/${user._id}` : '#', icon: faUser, label: 'Profile' },
    { to: '/edit', icon: faEdit, label: 'Edit' },
    { to: '/session', icon: faComments, label: 'Sessions' },
    { to: '/inbox', icon: faEnvelope, label: 'Inbox' },
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
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleInboxClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 text-white z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-6 h-6" />
      </button>

      <div
        className={`fixed border-r-2 border-r-gray-600 overflow-y-auto top-0 left-0 h-screen w-80 bg-[#080101] p-5 font-poppins text-white shadow-md shadow-gray-800/10 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:block`}
      >
        <div className="mb-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-12" />
          </Link>
        </div>

        <nav className="flex flex-col space-y-4">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center space-x-3 hover:bg-blue-500 hover:rounded-md p-2 transition-all duration-200"
              onClick={to === '/inbox' ? handleInboxClick : undefined}
            >
              <FontAwesomeIcon icon={icon} className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
          <a
            href="https://chatbot-last-bf47.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 hover:bg-blue-500 hover:rounded-md p-2 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5" />
            <span>Ask</span>
          </a>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center space-x-3 hover:bg-blue-500 hover:rounded-md p-2 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSquarePlus} className="w-5 h-5" />
            <span>Create</span>
          </button>
        </nav>

        <div className="mt-8 flex flex-col space-y-3">
          <button
            onClick={logoutHandler}
            className="flex items-center space-x-3 bg-red-500 px-3 py-2 rounded-md hover:bg-red-700 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <Create open={openCreateModal} setOpen={setOpenCreateModal} />
      </div>

      {/* Modal for no sessions scheduled */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default LeftNavbar;
