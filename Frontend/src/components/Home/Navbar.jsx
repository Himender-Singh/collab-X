import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const { user } = useSelector((store) => store.auth);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const protectedRoutes = ["/explore", "/mentors", "/profile", "/about"];
    if (!user && protectedRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [user, location, navigate]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
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

  const shouldShowNavbar = () => {
    return ["/", "/login", "/signup"].includes(location.pathname);
  };

  const handleLinkClick = (e, path) => {
    if (!user && !["/", "/login", "/signup"].includes(path)) {
      e.preventDefault();
      navigate("/login");
    } else {
      setIsOpen(false);
    }
  };

  return (
    shouldShowNavbar() && (
      <nav className="fixed bg-[#010101] top-0 left-0 w-full font-mono text-white z-50">
        <div className="container max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-12">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Navbar Tabs */}
          <div className="ml-12">
            <div
              className="hidden text-base font-bold md:flex space-x-6 lg:space-x-8"
              ref={menuRef}
            >
              <Link
                to="/"
                className="hover:text-blue-500"
                onClick={(e) => handleLinkClick(e, "/")}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className="hover:text-blue-500"
                onClick={(e) => handleLinkClick(e, "/explore")}
              >
                Explore
              </Link>

              {/* Community Dropdown */}
              <div
                className="relative"
                // onMouseEnter={() => setShowDropdown(true)}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Link to="#" className="hover:text-blue-500">
                  Community ▼
                </Link>

                {/* Dropdown Modal */}
                {showDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2"
                    ref={dropdownRef}
                  >
                    <Link
                      to="/connect"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Connect
                    </Link>
                    <Link
                      to="/mock-interview"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Mock Interview
                    </Link>
                    <Link
                      to="/find-peers"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Find Peers
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="https://chatbot-last-bf47.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                Ask
              </Link>
              <Link to="/about" className="hover:text-blue-500">
                <span className="text-white  px-7 py-2 text-md rounded-full bg-gradient-to-l from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                  Let's code!
                </span>
              </Link>
            </div>
          </div>

          {/* Right - Profile & Logout */}
          <div className="space-x-2 sm:space-x-4 flex items-center ml-auto">
            {user ? (
              <>
                <Link to="/profile" className="hover:text-blue-500">
                  <img
                    src={user?.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
                <button
                  onClick={logoutHandler}
                  className="border-2 border-violet-700 text-white px-7 py-2 rounded-full"
                >
                  <span className="text-xl">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white p-0 md:px-7 md:py-2 text-lg md:text-xl rounded-full md:border-2 border-violet-500 transition-all duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="text-white md:px-7 md:py-3 text-xl rounded-full bg-gradient-to-l from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  Try now
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex ml-auto">
              <button onClick={toggleMenu} aria-label="Toggle menu">
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isOpen ? "block fixed w-full" : "hidden"
          } bg-[#080101] h-screen flex-1 transition-all text-2xl duration-300 ease-in-out`}
        >
          <div className="flex flex-col items-start py-4 px-4">
            <Link
              to="/"
              className="hover:text-blue-500 w-full py-4 border-b-2"
              onClick={(e) => handleLinkClick(e, "/")}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className="hover:text-blue-500 w-full py-4 border-b-2"
              onClick={(e) => handleLinkClick(e, "/explore")}
            >
              Explore
            </Link>
            {/* Community Dropdown */}
            <div
              className="relative w-full py-4 border-b-2"
              // onMouseEnter={() => setShowDropdown(true)}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Link to="#" className="hover:text-blue-500">
                Community ▼
              </Link>

              {/* Dropdown Modal */}
              {showDropdown && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2"
                  ref={dropdownRef}
                >
                  <Link
                    to="/connect"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Connect
                  </Link>
                  <Link
                    to="/mock-interview"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Mock Interview
                  </Link>
                  <Link
                    to="/find-peers"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Find Peers
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="https://chatbot-last-bf47.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 w-full py-4 border-b-2"
            >
              Ask
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-500 w-full py-4 border-b-2"
              onClick={(e) => handleLinkClick(e, "/about")}
            >
              Let's code!
            </Link>
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
