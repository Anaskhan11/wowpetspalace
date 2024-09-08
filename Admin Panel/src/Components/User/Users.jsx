import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

// ICONS
import { FaEye } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";

const Users = () => {
  // state for users
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/users/getalluser`
        );
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/users/deleteuser/` + id,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);

        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
      } else {
        toast.error(res.data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Dashboard Users</h2>
            </div>
          </div>
        </div>
        {/* row */}
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard Users List</h1>
                <Link to="/adduser" className="BtnUser w-fit">
                  Add User
                </Link>
              </div>

              <div className="full price_table padding_infor_info">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive-sm">
                      <table className="table  table-striped projects">
                        <thead className="thead-dark">
                          <tr>
                            <th>Image</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((data, index) => (
                            <tr key={index}>
                              <td>
                                <img
                                  src={
                                    `${import.meta.env.VITE_APP_BASE_URL}/` +
                                    data.image
                                  }
                                  className="h-16 w-16 rounded-full object-cover"
                                  alt={data.first_name}
                                />
                              </td>
                              <td>{data.first_name}</td>
                              <td>{data.last_name}</td>
                              <td>{data.roleName}</td>
                              <td style={{ width: "25px" }}>{data.email}</td>
                              <td>{data.phone}</td>
                              <td
                                style={{
                                  color:
                                    data.status === 1 ? "#00d38c" : "#ff4700",

                                  borderRadius: "5px",
                                }}
                              >
                                {data.status === 1 ? "Active" : "Inactive"}
                              </td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/detailpage`}
                                    state={{ data: data }}
                                    type="button"
                                    className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center"
                                    style={{ marginRight: "5px" }} // Adjust the value as needed
                                  >
                                    <FaEye className="w-6 h-6" />
                                  </Link>
                                  <Link
                                    to={`/edituser/${data.id}`}
                                    type="button"
                                    className="bg-yellow-400 text-white p-2 rounded-full flex items-center justify-center"
                                    style={{ marginRight: "5px" }} // Adjust the value as needed
                                  >
                                    <FaPenToSquare className="w-6 h-6" />
                                  </Link>
                                  <button
                                    type="button"
                                    className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center"
                                    onClick={() => {
                                      console.log(
                                        "Deleting user with id:",
                                        data.id
                                      );
                                      handleDelete(data.id);
                                    }}
                                  >
                                    <FaTrash className="w-6 h-6" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
