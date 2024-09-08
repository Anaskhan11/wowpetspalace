import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

const AddUser = () => {
  // state for adding user
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    roleid: "",
    email: "",
    phone: "",
    status: "",
    alternative_phone: "",
    image: "",
    note: "",
    password: "",
    confirmpassword: "",
    address: "",
    alternative_address: "",
    dob: "",
    gender: "",
    is_admin: false,
    enable_email_notification: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/role/role`
        );
        console.log("checking res role", res.data);
        setRoles(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
      imageSelected: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.password !== formData.confirmpassword) {
        toast.error("Passwords do not match.");
        return;
      }
      const formattedDateOfBirth = new Date(formData.dob).toLocaleDateString(
        "en-US"
      );
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.set("dob", formattedDateOfBirth);

      const res = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/users/adduser`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success(res.data.message);

        navigate("/user");
      } else {
        toast.error("Failed to add user. Please check the provided data.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to add user. Please check the provided data.");
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Add Users</h2>
            </div>
          </div>
        </div>
        <div className="white_shd mx-auto">
          <form onSubmit={handleSubmit} className="w-2/3 mx-auto py-6">
            <div className="row">
              <div className="col-md-4">
                <div className="field margin_0">
                  <label className="label_field">Image</label>
                  {formData.imageSelected ? (
                    <>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="form-control"
                        accept="image/*"
                      />
                      <small>Selected file: {formData.image.name}</small>
                    </>
                  ) : (
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="form-control"
                      accept="image/*"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="field margin_0">
                  <label className="label_field">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="field margin_0">
                  <label className="label_field">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Role</label>
                  <select
                    name="roleid"
                    value={formData.roleid}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {roles.map((role) => (
                      <option key={role.roleid} value={role.roleid}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Alternative Phone</label>
                  <input
                    type="text"
                    name="alternative_phone"
                    value={formData.alternative_phone}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Note</label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmpassword"
                    value={formData.confirmpassword}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="" disabled>
                      Select a status
                    </option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Alternative Address</label>
                  <input
                    type="text"
                    name="alternative_address"
                    value={formData.alternative_address}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Data of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="field margin_0">
                  <label className="label_field">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    className="form-control"
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select a Gender
                    </option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="my-4 ">
              <div className="flex items-center gap-4 justify-between flex-wrap">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheckbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                  />
                  <label className="label_field" htmlFor="exampleCheckbox">
                    Is Admin
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheckbox"
                    name="enable_email_notification"
                    onChange={handleInputChange}
                    checked={formData.enable_email_notification}
                  />
                  <label className="label_field" htmlFor="exampleCheckbox">
                    Enable Email Notification
                  </label>
                </div>
                <button className="w-fit ml-auto bg-blue-500 px-4 py-3 rounded-md text-white">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
