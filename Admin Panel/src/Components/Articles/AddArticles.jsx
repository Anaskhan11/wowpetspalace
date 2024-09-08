import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import api from "../../axios/api.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddArticles = () => {
  const [category, setCategory] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryid: "",
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const categoryResponse = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/article/showarticle`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setCategory(categoryResponse.data);

      const tagsResponse = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/article/getalltags`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setAllTags(tagsResponse.data.result);
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const toggleTagSelection = (tagId) => {
    setSelectedTags(
      selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    formDataToSend.append("userid", secureLocalStorage.getItem("userId"));
    selectedTags.forEach((tag) => formDataToSend.append("tags[]", tag));

    try {
      const response = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/article/addarticle`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Article added successfully!");
        navigate("/articles");
      } else {
        toast.error("Failed to add article.");
      }
    } catch (error) {
      toast.error("Error occurred while adding article.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Add Article</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            name="categoryid"
            value={formData.categoryid}
            onChange={handleInputChange}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
          >
            <option value="">Select a Category</option>
            {category.map((cat) => (
              <option key={cat.categoryid} value={cat.categoryid}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                className={`px-3 py-1.5 text-sm border rounded-full cursor-pointer select-none ${
                  selectedTags.includes(tag.id)
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
                onClick={() => toggleTagSelection(tag.id)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            className="h-48 mb-4"
          />
        </div>

        <button
          type="submit"
          className="mt-14 sm:mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default AddArticles;
