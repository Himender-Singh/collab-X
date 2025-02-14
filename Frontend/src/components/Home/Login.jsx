import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/logo.png"; // Ensure the path to your logo is correct
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../../redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error,setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8080/api/v1/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/feed");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-screen ">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-10 border shadow-lg rounded-lg">
        <div className="flex items-center justify-center mb-5">
          {/* Logo */}
          <img src={img} alt="Logo" className="w-12" />
        </div>
        <div className="title_container mb-4 text-center">
          <p className="text-xl font-bold text-white">Login to your Account</p>
          <span className="text-sm text-gray-300">
            Get started with our app, just create an account and enjoy the
            experience.
          </span>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}{" "}
        {/* Error message display */}
        <form className="flex flex-col w-full" onSubmit={loginHandler}>
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
                placeholder="name@mail.com"
                name="email"
                type="email"
                className="flex-1 px-2 py-1 bg-[#1e293b] text-white placeholder-gray-400 border-none focus:outline-none"
                id="email_field"
                required
                value={input.email}
                onChange={changeEventHandler}
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
                className="flex-1 px-2 py-1 bg-[#1e293b] text-white placeholder-gray-400 border-none focus:outline-none"
                id="password_field"
                required
                value={input.password}
                onChange={changeEventHandler}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mb-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
          >
            <span>Sign In</span>
          </button>

          <div className="flex items-center mb-4">
            <hr className="flex-grow border-t border-gray-600" />
            <span className="mx-2 text-gray-500">Or</span>
            <hr className="flex-grow border-t border-gray-600" />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              I don't have an account.{" "}
              <Link to={"/signup"} className="text-blue-400 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
