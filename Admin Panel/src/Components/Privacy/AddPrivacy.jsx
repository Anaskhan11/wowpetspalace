import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

// Froala
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import ReactQuill from "react-quill";

const AddPrivacyPolicy = () => {
  // State for adding privacy policy
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // Function to handle submission of new privacy policy
  const handleAddPrivacyPolicy = (e) => {
    e.preventDefault();

    // Send data to backend API to add the privacy policy
    const formData = {
      title,
      description,
    };

    api
      .post(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/privacyAndTermRoutes/createPrivacy`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/privacy policy", { replace: true });
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error adding privacy policy:", error);
        toast.error("Failed to add privacy policy. Please try again.");
      });
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Add Privacy Policy</h2>
            </div>
          </div>
        </div>
        <div className="row column1 mx-auto">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <form onSubmit={handleAddPrivacyPolicy}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="field margin_0">
                        <label className="label_field">Title</label>
                        <input
                          type="text"
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 ">
                      <div className="field margin_0 h-full flex flex-col">
                        <label className="label_field">Description</label>
                        <ReactQuill
                          className="w-full min-h-[115px] max-h-[115px]"
                          theme="snow"
                          value={description}
                          onChange={(description) =>
                            setDescription(description)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row pr-[10px] my-2">
                    <button
                      type="submit"
                      className="ml-auto w-fit px-4 py-3 bg-blue-500 text-white my-14 rounded-md"
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
export default AddPrivacyPolicy;
