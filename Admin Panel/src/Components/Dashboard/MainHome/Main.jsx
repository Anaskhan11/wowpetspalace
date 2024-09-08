import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../../utils/tokenExpired.js";
import api from "../../../axios/api.js";

// icons
import { FaUserLarge } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";
import { FaShield } from "react-icons/fa6";
import { FaRegHardDrive } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGooglePlusG } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const Main = () => {
  // state for main home page
  const [userCount, setUserCount] = useState([]);
  const [role, setRole] = useState([]);
  const [page, setPage] = useState([]);
  const [permission, setPermission] = useState([]);
  const navigate = useNavigate();

  console.log("DASHBOARD PAGE...");

  useEffect(() => {
    const countUser = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/users/allusers`
        );

        setUserCount(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    countUser();
  }, []);

  useEffect(() => {
    const countRole = async () => {
      try {
        const resp = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/role/countrole`
        );

        setRole(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    countRole();
  }, []);

  useEffect(() => {
    const countPage = async () => {
      try {
        const resp = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/pages/countpage`
        );

        setPage(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    countPage();
  }, []);
  useEffect(() => {
    const countPermission = async () => {
      try {
        const resp = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/permission/getpermissioncount`
        );

        setPermission(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    countPermission();
  }, []);

  return (
    <div className="midde_cont">
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Dashboard</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-6 col-lg-3">
            <div className="full counter_section margin_bottom_30 flex flex-col items-center cursor-pointer">
              <FaUserLarge className="text-yellow-400 h-16 w-16 my-4" />

              <div className="counter_no">
                <div className="flex flex-col items-center justify-center">
                  {userCount.length > 0 &&
                    userCount.map((data, index) => (
                      <p key={index} className="total_no text-center">
                        {data.userCount}
                      </p>
                    ))}

                  <p className="head_couter text-center">Dashboard Users</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="full counter_section margin_bottom_30 flex flex-col items-center cursor-pointer">
              <FaUsersGear className="text-blue-500 h-16 w-16 my-4" />
              <div className="counter_no">
                <div>
                  {role.map((dataa, index) => (
                    <p key={index} className="total_no text-center">
                      {dataa.roleCount}
                    </p>
                  ))}
                  <p className="head_couter text-center">Total Roles</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="full counter_section margin_bottom_30 flex flex-col items-center cursor-pointer">
              <FaRegHardDrive className="text-green-500 h-16 w-16 my-4" />

              <div className="counter_no">
                <div>
                  {page.map((dat, index) => (
                    <p key={index} className="total_no text-center">
                      {dat.pageCount}
                    </p>
                  ))}
                  <p className="head_couter text-center">Total Pages</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="full counter_section margin_bottom_30 flex flex-col items-center cursor-pointer">
              <FaShield className="text-blue-600 h-16 w-16 my-4" />
              <div className="counter_no">
                <div>
                  {permission.map((data, index) => (
                    <p key={index} className="total_no text-center">
                      {data.permissionCount}
                    </p>
                  ))}

                  <p className="head_couter text-center">Total Permission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row column1 social_media_section">
          <div className="col-md-6 col-lg-3">
            <div className="full socile_icons fb margin_bottom_30">
              <div className="social_icon flex justify-center items-center">
                <FaFacebookF />
              </div>
              <div className="social_cont">
                <ul>
                  <li>
                    <span>
                      <strong>35k</strong>
                    </span>
                    <span>Friends</span>
                  </li>
                  <li>
                    <span>
                      <strong>128</strong>
                    </span>
                    <span>Feeds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="full socile_icons tw margin_bottom_30">
              <div className="social_icon flex justify-center items-center">
                <FaXTwitter />
              </div>
              <div className="social_cont">
                <ul>
                  <li>
                    <span>
                      <strong>584k</strong>
                    </span>
                    <span>Followers</span>
                  </li>
                  <li>
                    <span>
                      <strong>978</strong>
                    </span>
                    <span>Tweets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="full socile_icons linked margin_bottom_30">
              <div className="social_icon flex justify-center items-center">
                <FaLinkedinIn />
              </div>
              <div className="social_cont">
                <ul>
                  <li>
                    <span>
                      <strong>758+</strong>
                    </span>
                    <span>Contacts</span>
                  </li>
                  <li>
                    <span>
                      <strong>365</strong>
                    </span>
                    <span>Feeds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="full socile_icons google_p margin_bottom_30 ">
              <div className="social_icon flex justify-center items-center">
                <FaGooglePlusG />
              </div>
              <div className="social_cont">
                <ul>
                  <li>
                    <span>
                      <strong>450</strong>
                    </span>
                    <span>Followers</span>
                  </li>
                  <li>
                    <span>
                      <strong>57</strong>
                    </span>
                    <span>Circles</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
