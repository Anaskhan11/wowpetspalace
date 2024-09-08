import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import ReactQuill from "react-quill";

const AddSlider = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("null");
  const [url, setURL] = useState("");
  const [date, setDate] = useState("null");
  const [defaultSlider, setDefaultSlider] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("url", url);
    formData.append("expiryDate", date);
    formData.append("defaultSlider", defaultSlider);
    // file is a fileList object
    Array.from(file).forEach((file) => {
      formData.append("images", file);
    });

    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/slider/createSlider`,
      formData
    );
    if (response.status === 200) {
      toast.success(response.data.message);
      navigate("/slider");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Add Slider Images</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12 w-full">
            <div className="white_shd py-6 mx-auto margin_bottom_30">
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="field margin_0">
                        <label className="label_field">Image</label>

                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                          accept="image/*"
                          required
                        />
                      </div>

                      <div className="field margin_0">
                        <label className="label_field">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">Expiry Date</label>
                        <input
                          type="date"
                          name="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">URL</label>
                        <input
                          type="text"
                          name="url"
                          value={url}
                          onChange={(e) => setURL(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">Status</label>
                        <select
                          name="status"
                          className="form-control"
                          required
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="" disabled selected>
                            Select a status
                          </option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                      <div className="field margin_0 bg-slate-200 border border-gray-800 p-2 mt-4">
                        <label className="label_field">Default Slider</label>
                        <input
                          type="checkbox"
                          name="defaultSlider"
                          value={defaultSlider}
                          onChange={(e) => {
                            setDefaultSlider(defaultSlider === 0 ? 1 : 0);
                          }}
                          className="block h-5 w-5"
                          checked={defaultSlider === 1}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 p-0 ">
                      <div className="field margin_0 h-full flex flex-col items-start ">
                        <label className="label_field">Description</label>
                        <ReactQuill
                          className="w-full max-h-[320px] min-h-[320px]"
                          theme="snow"
                          value={description}
                          onChange={setDescription}
                          required
                        />
                      </div>
                    </div>
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

export default AddSlider;
