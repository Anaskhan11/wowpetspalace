import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

import ReactQuill from "react-quill";

const AddCategoryArticle = () => {
  // state for adding a category article
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    image: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const res = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/categoryarticle/addcategory`,
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
        navigate("/categoryarticles");
      } else {
        toast.error("Failed to add Article. Please check the provided data.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to add Article. Please check the provided data.");
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Add Category Articles</h2>
            </div>
          </div>
        </div>
        <div className="row column1 mx-auto">
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
                            required
                          />
                        )}
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">Category Name</label>
                        <input
                          type="text"
                          name="categoryName"
                          value={formData.categoryName}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className="field margin_0 ">
                        <label className="label_field">Description</label>
                        <ReactQuill
                          className="w-full min-h-[75px] max-h-[75px]"
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
                  <div className="row">
                    <button
                      type="submit"
                      className="w-fit ml-auto px-4 py-3 rounded-md bg-blue-500 text-white my-2"
                    >
                      Submit
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

export default AddCategoryArticle;
