import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

const UserProfile = () => {
  // state for user profile
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/users/getuserprofilebyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        const userData = res.data.data;
        setUsers({
          first_name: userData.first_name,
          last_name: userData.last_name,
          roleName: userData.roleName,
          email: userData.email,
          phone: userData.phone,
          alternative_phone: userData.alternative_phone,
          status: userData.status,
          image: userData.image,
          note: userData.note,
          password: userData.password,
          confirmpassword: userData.confirmpassword,
          address: userData.address,
          alternative_address: userData.alternative_address,
          dob: userData.dob,
          gender: userData.gender,
          is_admin: userData.is_admin,
          enable_email_notification: userData.enable_email_notification,
        });

        console.log("Get User profile", userData);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Profile</h2>
              </div>
            </div>
          </div>
          {/* row */}
          <div className="row column1">
            <div className="col-md-2" />
            <div className="col-md-8">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head">
                  <div className="heading1 margin_0">
                    <h2>User profile</h2>
                  </div>
                </div>
                <div className="full price_table padding_infor_info">
                  <div className="row">
                    {/* user profile section */}
                    {/* profile image */}
                    <div className="col-lg-12">
                      <div className="full dis_flex center_text">
                        <div className="profile_img">
                          <img
                            width={180}
                            height={150}
                            className="rounded-md shadow shadow-md shadow-slate-700"
                            src={
                              `${import.meta.env.VITE_APP_BASE_URL}/` +
                              users.image
                            }
                            alt="logo"
                          />
                        </div>
                        <div className="profile_contant">
                          <div className="contact_inner">
                            <h3>Name: {users.first_name}</h3>
                            <p>
                              <strong>Role: </strong>
                              {users.roleName}
                            </p>
                            <ul className="list-unstyled">
                              <li>
                                Email <i className="fa fa-envelope-o" /> :{" "}
                                {users.email}
                              </li>
                              <li>
                                Phone <i className="fa fa-phone" /> :{" "}
                                {users.phone}
                              </li>
                              <li>
                                Alternative Phone <i className="fa fa-phone" />{" "}
                                :{users.alternative_phone}
                              </li>
                              <li>
                                Address <i className="fa fa-envelope-o" /> :{" "}
                                {users.address}
                              </li>
                              <li>
                                Alternative Address{" "}
                                <i className="fa fa-envelope-o" /> :{" "}
                                {users.alternative_address}
                              </li>
                              <li>
                                Gender :{" "}
                                {users.gender === 1 ? "male" : "female"}
                              </li>
                              <li>Date of Birth : {users.dob}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
