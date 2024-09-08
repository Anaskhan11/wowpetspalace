import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import api from "../../axios/api";

const Login = ({ setIsAuthenticated }) => {
  // state for user login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/users/login`,
        {
          email,
          password,
        }
      );
      console.log("Checking login response data", response.data);

      if (response.status === 200) {
        const { roleid, id, accessToken } = response.data;
        secureLocalStorage.setItem("userId", id);
        secureLocalStorage.setItem("roleid", roleid);
        secureLocalStorage.setItem("accessToken", accessToken);
        console.log("user logged in succesfully.");
        setIsAuthenticated(true);

        navigate("/dashboard", { replace: true });

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
      } else if (response.status === 401) {
        toast.error("Error Notification!", {
          position: "top-center",
        });
      } else {
        toast.warning("Internal Server Error", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error during login:", error.message);
      toast.warning("Email or passowrd is Incorrect", {
        position: "top-center",
      });
    }
    // window.location.reload();
  };
  const isAuthenticated = secureLocalStorage.getItem("accessToken");

  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} replace={true} />;
  }
  return (
    <>
      <div className="full_container">
        <div className="container">
          <div className="center verticle_center full_height">
            <div className="login_section">
              <div className="logo_login">
                <div className="center">
                  <img
                    width={210}
                    src={"/v1/dashboard/images/logo/circular-logo-1.svg"}
                    alt="brand logo"
                  />
                </div>
              </div>
              <div className="login_form">
                <form onSubmit={handleLogin}>
                  <fieldset>
                    <div className="field">
                      <label className="label_field">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="label_field">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="field margin_0">
                      <button className="main_bt">Sign In</button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
