import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../../context/SidebarContext";
import secureLocalStorage from "react-secure-storage";
import api from "../../../axios/api.js";

// icons
import { MdArrowBackIos } from "react-icons/md";
import { FaHouzz, FaTags } from "react-icons/fa6";
import { FaPerson } from "react-icons/fa6";
import { FaReadme } from "react-icons/fa6";
import { FaRegFolderOpen } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaYarn } from "react-icons/fa6";
import { SiGoogleads } from "react-icons/si";
import { RxSlider } from "react-icons/rx";
import { MdPolicy } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { FaFirstOrder } from "react-icons/fa";
const Sidebar = () => {
  // state for user data
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);

  // useSidebarContetx
  const { sidebar, showSidebar } = useContext(SidebarContext);

  useEffect(() => {
    const id = secureLocalStorage.getItem("userId");
    const getUserById = async () => {
      await api
        .get(
          `${import.meta.env.VITE_APP_BASE_URL}/users/getuserprofilebyid/${id}`
        )
        .then((res) => {
          console.log(res.data.data, "user profile image");
          setUser(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUserById();
  }, []);

  useEffect(() => {
    const fetchPagesAndPermissions = async () => {
      try {
        const roleid = secureLocalStorage.getItem("roleid");
        if (roleid) {
          const response = await api.get(
            `${
              import.meta.env.VITE_APP_BASE_URL
            }/users/pageAndpermission/${roleid}`
          );

          const pages = response.data;
          setUserData((prevUserData) => ({
            ...prevUserData,
            pages: pages,
          }));
        }
      } catch (error) {
        console.error("Error fetching pages and permissions:", error);
      }
    };

    if (secureLocalStorage.getItem("roleid")) {
      fetchPagesAndPermissions();
    }
  }, []);

  return (
    <>
      {sidebar && secureLocalStorage.getItem("accessToken") ? (
        <div>
          <nav id="sidebar" className="sidebar relative">
            <div className="sidebar_blog_1">
              <div className="sidebar_user_info ">
                <div className="cross-icon-small-screen absolute top-[40%] p-4 rounded-full bg-white shadow shadow-sm text-red-400 right-2">
                  <MdArrowBackIos onClick={showSidebar} className="h-6 w-6" />
                </div>
                <div className="icon_setting" />
                <div className="user_profle_side">
                  <div className="user_img">
                    {user && user.image ? (
                      <img
                        src={`${import.meta.env.VITE_APP_BASE_URL}/${
                          user.image
                        }`}
                        alt="user"
                        className="rounded-full h-20 w-20 object-cover"
                      />
                    ) : (
                      <img
                        src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                        alt="user"
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="user_info">
                    <h6>{user && user.first_name}</h6>
                    <p>
                      <span className="online_animation" /> Online
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar_blog_2">
              <ul className="list-unstyled components">
                {userData && userData.pages ? (
                  [...new Set(userData.pages.map((page) => page.pageName))].map(
                    (uniquePageName) => (
                      <li key={uniquePageName} onClick={showSidebar}>
                        <Link
                          className="flex items-center gap-3 hover:shadow-md hover:bg-green-900 hover:scale-95"
                          to={`/${uniquePageName.toLowerCase()}`}
                        >
                          {/* Here below goes the icons for each page dynamically */}
                          {uniquePageName === "dashboard" && (
                            <FaHouzz className="h-6 w-6 text-yellow-500" />
                          )}
                          {uniquePageName === "User" && (
                            <FaPerson className="h-6 w-6 text-orange-500" />
                          )}
                          {uniquePageName === "role" && (
                            <FaUserGear className="h-6 w-6 text-green-500" />
                          )}
                          {uniquePageName === "Articles" && (
                            <FaReadme className="h-6 w-6 text-blue-500" />
                          )}
                          {uniquePageName === "CategoryArticles" && (
                            <FaRegFolderOpen className="h-6 w-6 text-violet-500" />
                          )}
                          {uniquePageName === "Breeds" && (
                            <FaYarn className="h-6 w-6 text-indigo-500" />
                          )}
                          {uniquePageName === "BreedsCategory" && (
                            <FaRegFolderOpen className="h-6 w-6 text-slate-500" />
                          )}
                          {uniquePageName === "advertisement" && (
                            <SiGoogleads className="h-6 w-6 text-red-800" />
                          )}
                          {uniquePageName === "App User" && (
                            <FaPerson className="h-6 w-6 text-gray-100" />
                          )}
                          {uniquePageName === "slider" && (
                            <RxSlider className="h-6 w-6 text-orange-600" />
                          )}
                          {uniquePageName === "privacy policy" && (
                            <MdPolicy className="h-6 w-6 text-lime-600" />
                          )}
                          {uniquePageName === "term and condition" && (
                            <IoDocumentText className="h-6 w-6 text-violet-600" />
                          )}
                          {uniquePageName === "contact_us" && (
                            <FaPhoneVolume className="h-6 w-6 text-cyan-400" />
                          )}
                          {uniquePageName === "shops" && (
                            <FaShop className="h-6 w-6 text-cyan-400" />
                          )}
                          {uniquePageName === "Orders" && (
                            <FaFirstOrder className="h-6 w-6 text-red-600" />
                          )}

                          <span className="text-xl hover:text-white">
                            {uniquePageName}
                          </span>
                        </Link>
                      </li>
                    )
                  )
                ) : (
                  <li>Loading...</li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
