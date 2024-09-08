import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/authUser/signin`,
        {
          email,
          password,
        }
      );
      console.log("Login", res.data);
      if (res.data.message === "Login successful") {
        localStorage.setItem("token", res.data.data.authToken);
        console.log("Login", res.data);
        navigate("/");
        toast.success("Login Successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.warning("Email or passowrd is Incorrect", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.warning("Email or passowrd is Incorrect", {
        position: "top-center",
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/authUser/registeruser`,
        {
          email,
          password,
        }
      );

      if (res.data.message === "User registered successfully") {
        localStorage.setItem("token", res.data.data.authToken);

        navigate("/");
        toast.success("User registered successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.warning("Failed to Register User", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.warning("Some thing went wrong", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-20 bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 ">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="loginEmail"
                >
                  Username or email address{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="loginEmail"
                  type="email"
                  value={email}
                  placeholder="Username or email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="loginPassword"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="loginPassword"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
              </div>
              <div className="mb-4">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  type="submit"
                >
                  Log In
                </button>
              </div>
              <div className="text-right">
                <a href="#" className="text-orange-500 hover:text-orange-600">
                  Lost your password?
                </a>
              </div>
            </form>
          </div>
          <div className="bg-white p-8 ">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="registerEmail"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="registerEmail"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="registerPassword"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="registerPassword"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="registerConfirmPassword"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="registerConfirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <p className="text-gray-700 text-sm">
                  A link to set a new password will be sent to your email
                  address. Your personal data will be used to support your
                  experience throughout this website, to manage access to your
                  account, and for other purposes described in our{" "}
                  <a href="#" className="text-orange-500 hover:text-orange-600">
                    privacy policy
                  </a>
                  .
                </p>
              </div>
              <div className="mb-4">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
