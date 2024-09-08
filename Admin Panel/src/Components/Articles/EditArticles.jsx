import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired.js";
import api from "../../axios/api";

// Froala
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import ReactQuill from "react-quill";
const EditArticles = () => {
  // state for editing articles
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryid: "",
    image: "",
  });
  // take the id from the url
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/article/editarticle/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        console.log("checking res", res);
        const articleData = res.data.data;
        console.log("check artical data", articleData);

        setFormData({
          categoryid: articleData.categoryid,
          title: articleData.title,
          description: articleData.description,
        });
      } catch (error) {
        console.log("Error fetching article:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/article/showarticle`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        if (response.status === 200) {
          setCategory(response.data);
        }
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchArticle();
    fetchCategories();
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
        `${import.meta.env.VITE_APP_BASE_URL}/article/updatearticle/${id}`,
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
        navigate("/articles");
      } else {
        toast.error(res.data.message || "Failed to update Articles.");
      }
    } catch (error) {
      console.error("Error updating Articles:", error.message);
      toast.error("Failed to update Articles.");
    }
  };
  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Edit Articles</h2>
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
                        <label className="label_field">Category Name</label>
                        <select
                          name="categoryid"
                          value={formData.categoryid}
                          onChange={handleInputChange}
                          // onChange={(e) => setFormData(e.target.value)}
                          className="form-control"
                          required
                        >
                          <option value="" disabled>
                            Select a Category
                          </option>
                          {category.map((data) => (
                            <option
                              key={data.categoryid}
                              value={data.categoryid}
                            >
                              {data.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">Title</label>
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
                    <div className="col-md-6">
                      <div className="field margin_0 h-full flex flex-col">
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
                      className="w-fit ml-auto my-4 px-4 py-3 bg-blue-500 text-white font-semibold rounded-md"
                    >
                      Update Article
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

export default EditArticles;
