import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import api from "../../axios/api";

// ICONS
import { TiUserAddOutline } from "react-icons/ti";

const Role = () => {
  const [role, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/role/role`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        setRoles(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRole();
  }, []);

  return (
    <>
      <div className="midde_cont w-full">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Settings/Roles</h2>
              </div>
            </div>
          </div>
          {/* row */}
          <div className="row column4 graph">
            <div className="col-md-12  mx-auto">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Roles</h2>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/addRole"
                      className="flex bg-green-400 px-4 py-3 text-white rounded-md w-fit items-center gap-2 ml-auto"
                    >
                      <TiUserAddOutline className="h-6 w-6" />
                      Add Role
                    </Link>
                  </div>
                </div>
                <div className="full progress_bar_inner">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="msg_section">
                        <div className="msg_list_main flex gap-1">
                          <ul className="msg_list">
                            {role.map((data, index) => (
                              <li
                                key={index}
                                className=" hover:bg-orange-200 hover:cursor-pointer hover:text-white"
                              >
                                <span>
                                  <span className="name_user">
                                    {data.roleName}
                                  </span>
                                </span>
                              </li>
                            ))}
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
    </>
  );
};

export default Role;
