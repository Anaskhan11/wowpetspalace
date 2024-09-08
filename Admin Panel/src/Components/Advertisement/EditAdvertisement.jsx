import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

const EditAdvertisement = () => {
  // state for editing user

  const [formData, setFormData] = useState({
    status: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/users/getuserbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        console.log("Checking Article Data ", res);
        const userData = res.data.data;
        const formattedDate = new Date(userData.dob)
          .toISOString()
          .split("T")[0];

        const formDataToSend = new FormData();
        Object.entries(formData.image).forEach(([key, value]) => {
          formDataToSend.append(key, value);
        });
        formDataToSend.set("dob", formattedDate);
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          roleid: userData.roleid,
          email: userData.email,
          phone: userData.phone,
          alternative_phone: userData.alternative_phone,
          status: userData.status,
          image: formDataToSend,
          note: userData.note,
          password: userData.password,
          confirmpassword: userData.confirmpassword,
          address: userData.address,
          alternative_address: userData.alternative_address,
          dob: formattedDate,
          gender: userData.gender,
          is_admin: userData.is_admin,
          enable_email_notification: userData.enable_email_notification,
        });

        console.log(userData);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const res = await api.put(
        `${import.meta.env.VITE_APP_BASE_URL}/users/updateuser/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/user");
      } else {
        toast.error(res.data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
      toast.error("Failed to update user.");
    }
  };
  return (
    <div className="midde_cont w-full ">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Edit Advertisement Status</h2>
            </div>
          </div>
        </div>

        <div className=" full margin_bottom_30">
          <div className="white_shd mx-auto">
            <form onSubmit={handleSubmit} className="w-2/3 mx-auto py-6">
              <div className="row">
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
                <div className="col-md-12">
                  <button
                    type="submit"
                    className="w-fit ml-auto px-4 py-3 bg-blue-500 text-white font-semibold rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdvertisement;
