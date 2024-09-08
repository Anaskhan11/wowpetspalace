import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import api from "../../axios/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBreeds = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [categoryid, setCategoryId] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const resBreeds = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/breedshow`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setBreeds(resBreeds.data);
      const resTags = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/getalltags`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setAllTags(resTags.data.result);
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const toggleTagSelection = (tagId) => {
    setSelectedTags(
      selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryid", categoryid);
    images.forEach((image) => formData.append("images", image));
    formData.append("userid", secureLocalStorage.getItem("userId"));
    selectedTags.forEach((tag) => formData.append("tags[]", tag));

    try {
      const response = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/createbreeds`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      toast.success("Breed added successfully!");
      navigate("/breeds");
    } catch (error) {
      toast.error("Error occurred while adding breed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Breed</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Images
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            value={categoryid}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
          >
            <option value="">Select a Category</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => toggleTagSelection(tag.id)}
                className={`px-3 py-1.5 text-sm border rounded-full cursor-pointer select-none ${
                  selectedTags.includes(tag.id)
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
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
            value={description}
            onChange={setDescription}
            className="h-48 mb-4"
          />
        </div>
        <button
          type="submit"
          className="mt-14 sm:mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Breed
        </button>
      </form>
    </div>
  );
};

export default AddBreeds;
