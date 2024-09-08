import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

import ReactQuill from "react-quill";

const EditBreedCategory = () => {
  // state for editing category
  const [formData, setFormData] = useState({
    title: "",
    description: "",

    image: "",
  });

  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/breed/getbreedbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        const articleData = res.data.data;
        console.log("check Breeds Category data", articleData);

        setFormData({
          title: articleData.title,
          description: articleData.description,
        });
      } catch (error) {
        console.log("Error fetching article:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!formData) {
        console.error("formData is not defined");
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const res = await api.put(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/updatebreedcategory/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      console.log("Checking update ", res);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/breedscategory");
      } else {
        toast.error(res.data.message || "Failed to update Breeds Category .");
      }
    } catch (error) {
      console.error("Error updating Breeds Category :", error.message);
      toast.error("Failed to update Breeds Category .");
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Edit And Update Category Articles</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
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
                          />
                        )}
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className="field margin_0">
                        <label className="label_field">Description</label>
                        <ReactQuill
                          className="w-full min-h-[115px] max-h-[115px]"
                          theme="snow"
                          value={formData.description}
                          onChange={(content) => {
                            setFormData((prev) => ({
                              ...prev,
                              description: content,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row pr-[10px]">
                    <button
                      type="submit"
                      className="ml-auto w-fit px-4 py-3 my-4 rounded-md bg-blue-500 text-white"
                    >
                      Update Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBreedCategory;
