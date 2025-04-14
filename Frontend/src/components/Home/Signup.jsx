import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faPerson } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/logo.png"; // Ensure the path to your logo is correct
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import { server } from "@/main";

const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "", // Changed from username to fullname
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server}/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "", // Reset fullname
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        console.error("Response data:", error.response.data); // Log the full response data
        setError(error.response.data.message || "Something went wrong");
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center mt-10 h-screen ">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-10 border shadow-lg rounded-lg">
        <div className="flex items-center justify-center mb-4">
          {/* Logo */}
          <img src={img} alt="Logo" className="w-12" />
        </div>
        <div className="title_container mb-4 text-center">
          <p className="text-xl font-bold text-white">Create Your Account</p>
          <span className="text-sm text-gray-300">
            Get started with our app, just create an account and enjoy the
            experience.
          </span>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}{" "}
        {/* Error message display */}
        <form className="flex flex-col w-full" onSubmit={signupHandler}>
          <div className="mb-4">
            <label
              className="block mb-1 text-sm font-medium text-white"
              htmlFor="name_field"
            >
              Full Name
            </label>
            <div className="flex items-center border border-gray-600 rounded-md p-2">
              <FontAwesomeIcon
                icon={faPerson}
                className="w-5 h-5 text-white mr-2"
              />
              <input
                placeholder="John"
                name="username"
                type="text"
                className="flex-1 px-2 py-1 bg-black text-white placeholder-gray-400 border-none focus:outline-none"
                id="name_field"
                value={input.username}
                onChange={changeEventHandler}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block mb-1 text-sm font-medium text-white"
              htmlFor="email_field"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-600 rounded-md p-2">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="w-5 h-5 text-white mr-2"
              />
              <input
                placeholder="John@mail.com"
                name="email"
                type="email"
                className="flex-1 px-2 py-1 bg-black text-white placeholder-gray-400 border-none focus:outline-none"
                id="email_field"
                value={input.email}
                onChange={changeEventHandler}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block mb-1 text-sm font-medium text-white"
              htmlFor="password_field"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-600 rounded-md p-2">
              <FontAwesomeIcon
                icon={faLock}
                className="w-5 h-5 text-white mr-2"
              />
              <input
                placeholder="Password"
                name="password"
                type="password"
                className="flex-1 px-2 py-1 bg-black text-white placeholder-gray-400 border-none focus:outline-none"
                id="password_field"
                value={input.password}
                onChange={changeEventHandler}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mb-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
          >
            <span>Sign Up</span>
          </button>

          <div className="flex items-center mb-4">
            <hr className="flex-grow border-t border-gray-600" />
            <span className="mx-2 text-gray-500">Or</span>
            <hr className="flex-grow border-t border-gray-600" />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              I already have an account.{" "}
              <Link to={"/login"} className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
