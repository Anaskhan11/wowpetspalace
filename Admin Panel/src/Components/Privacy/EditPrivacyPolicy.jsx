import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

// Froala
import ReactQuill from "react-quill";

//ICONS
import { FaTrash } from "react-icons/fa";

const EditPrivacyPolicy = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const res = await api.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/privacyAndTermRoutes/getprivacybyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        const policyData = res.data.result[0];

        setTitle(policyData.title);
        setDescription(policyData.description);
      } catch (error) {
        console.log("Error fetching privacy policy:", error);
      }
    };
    fetchPrivacyPolicy();
  }, [id]);

  const handleUpdatePolicy = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
    };

    try {
      const res = await api.put(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/privacyAndTermRoutes/updateprivacy/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/privacy policy");
      } else {
        toast.error(
          "Failed to update Privacy Policy. Please check the provided data."
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(
        "Failed to update Privacy Policy. Please check the provided data."
      );
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Edit Privacy Policy</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <form onSubmit={handleUpdatePolicy}>
                  <div className="row">
                    <div className="col-md-6">
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
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row pr-[10px] my-2">
                    <button
                      type="submit"
                      className="px-4 py-3 w-fit my-14 rounded-md bg-blue-500 text-white ml-auto"
                    >
                      Update
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
export default EditPrivacyPolicy;
