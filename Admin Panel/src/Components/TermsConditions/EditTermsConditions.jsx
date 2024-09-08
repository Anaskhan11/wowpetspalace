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

const EditTermsConditions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const res = await api.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/privacyAndTermRoutes/gettermbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        const termData = res.data.result[0];

        setTitle(termData.title);
        setDescription(termData.description);
      } catch (error) {
        console.log("Error fetching terms & conditions:", error);
      }
    };
    fetchTermsConditions();
  }, [id]);

  const handleUpdateTermsConditions = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
    };

    try {
      const res = await api.put(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/privacyAndTermRoutes/updateTerm/${id}`,
        formData,
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
        navigate("/term and condition");
      } else {
        toast.error(
          "Failed to update Terms & Conditions. Please check the provided data."
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(
        "Failed to update Terms & Conditions. Please check the provided data."
      );
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Edit Terms & Conditions</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <form onSubmit={handleUpdateTermsConditions}>
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
export default EditTermsConditions;
