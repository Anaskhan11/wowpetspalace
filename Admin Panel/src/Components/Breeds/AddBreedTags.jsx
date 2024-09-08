import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../axios/api.js";

const AddBreedTags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newTag.trim() !== "") {
        setTags((prevTags) => [...prevTags, newTag.trim()]);
        setNewTag("");
      }
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/addtagsforbreed`,
        {
          tags,
        }
      );
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Tags added successfully");
        navigate("/breeds");
      } else {
        toast.error("Failed to add tags");
      }
    } catch (error) {
      console.error("Error adding tags:", error);
      toast.error("Failed to add tags");
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Add Breed Tags</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12 w-full">
            <div className="white_shd py-6 mx-auto margin_bottom_30">
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="p-0">
                      <div className="w-full h-full flex flex-col items-start">
                        <label className="label_field">ADD TAGS</label>
                        <input
                          type="text"
                          value={newTag}
                          onChange={handleInputChange}
                          onKeyDown={handleInputKeyDown}
                          className="w-full py-2 px-4 border-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="tags-container mt-4">
                          {tags.map((tag, index) => (
                            <div
                              key={index}
                              className="tag bg-blue-500 text-white px-2 py-1 rounded-md inline-flex items-center mr-2 mb-2"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="ml-2 text-white focus:outline-none"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-12"></div>
                  </div>
                  <div className="row">
                    <button
                      type="submit"
                      className="w-fit ml-auto bg-blue-500 px-4 py-3 rounded-md text-white my-2"
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

export default AddBreedTags;
