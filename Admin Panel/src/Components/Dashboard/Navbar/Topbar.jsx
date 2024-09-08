import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarContext } from "../../../context/SidebarContext";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";
import api from "../../../axios/api.js";

// icons
import { FaBarsStaggered } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa6";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

const Topbar = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const { sidebar, showSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();

  // handle right top bar dropdown
  const handleRightTopBarDropDown = () => {
    setShow(!show);
  };
  useEffect(() => {
    const id = secureLocalStorage.getItem("userId");
    const getUserById = async () => {
      await api
        .get(
          `${import.meta.env.VITE_APP_BASE_URL}/users/getuserprofilebyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        )
        .then((res) => {
          setUser(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUserById();
  }, []);

  const logout = async () => {
    await api
      .get(`${import.meta.env.VITE_APP_BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.data.message) {
          setIsAuthenticated(false);
          secureLocalStorage.removeItem("userId");
          secureLocalStorage.removeItem("roleid");
          secureLocalStorage.removeItem("accessToken");
          secureLocalStorage.removeItem("refreshToken");
          Cookies.remove("token");
          Cookies.remove("connect.sid");
          Cookies.remove("roleid");
          Cookies.remove("id");
          toast.success("Logout Sucessfully");
          navigate("/login", { replace: true });
        }
      });
  };

  return (
    <div>
      {secureLocalStorage.getItem("accessToken") && (
        <div className={sidebar ? "topbar-2" : "topbar"}>
          <nav className="navbarTop flex">
            <div className="full flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className="hamburger_menu h-full py-4 px-6"
                  style={{ backgroundColor: "orangered" }}
                  onClick={showSidebar}
                >
                  <FaBarsStaggered className="text-white h-8 w-8" />
                </div>
                <div className="logo_section mb-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-between"
                  >
                    <img
                      className="img-responsive screen-large-nav-image"
                      src={`/v1/dashboard/images/logo/logo-no-background.svg`}
                      alt="logo"
                    />
                    <img
                      className="img-responsive screen-small-nav-image"
                      src={`/v1/dashboard/images/logo/logo-no-background-1.png`}
                      alt="logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="right_topbar">
                <div className="flex items-center gap-3 bg-red-500 text-white font-semibold h-20 p-2 ml-auto relative">
                  {user && user.image ? (
                    <img
                      src={`${import.meta.env.VITE_APP_BASE_URL}/${user.image}`}
                      alt="user"
                      className="rounded-full h-14 w-14 object-cover"
                    />
                  ) : (
                    <img
                      src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                      alt="user"
                      className="rounded-full"
                    />
                  )}

                  <span className="name_user">{user && user.first_name}</span>
                  <FaAngleDown
                    className="h-6 w-6"
                    onClick={handleRightTopBarDropDown}
                  />
                </div>
                {show && (
                  <div className="p-4 bg-[#333] text-white rounded-es-md absolute -bottom-30 right-0 flex flex-col gap-2 w-[209.84px]">
                    <Link
                      to={"/profile"}
                      className="flex items-center gap-2 hover:text-white"
                    >
                      <FaAddressCard className="h-6 w-6" />
                      <span className="text-xl">Profile</span>
                    </Link>
                    <p
                      className="cursor-pointer flex text-white items-center gap-2 hover:text-red-400"
                      onClick={logout}
                    >
                      <FaPersonWalkingLuggage className="h-6 w-6" />
                      <span className="text-xl">Logout</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Topbar;
