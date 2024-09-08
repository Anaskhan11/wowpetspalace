import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <main>
      <form
        className="p-4 rounded-md shadow shadow-md mx-auto w-1/3 my-14"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-green-700 my-6">Login</h2>
        <label>
          <span>Email Address:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="px-4 py-2 bg-green-700 rounded-md text-white">
          Login
        </button>
        <span className="block my-2">
          Doesnt have an account Signup{" "}
          <Link to="/signup" className="text-green-700">
            here
          </Link>{" "}
        </span>
      </form>
    </main>
  );
}
