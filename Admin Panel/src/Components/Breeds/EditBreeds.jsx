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

const EditBreeds = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [categoryid, setCategoryId] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [showimage, setShowimage] = useState([]);
  console.log("Checking show image", showimage);

  const getBreedNames = async () => {
    await api
      .get(`${import.meta.env.VITE_APP_BASE_URL}/breed/breedshow`, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setBreeds(res.data);
      });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BASE_URL}/breed/getbreedsbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        const breedData = res.data.data;

        setTitle(breedData.breed_title);
        setDescription(breedData.breed_description);
        setCategoryId(breedData.categoryid);

        const imagesArray = breedData.breed_images.split(",");
        const idsArray = breedData.id.split(",");

        const resultArray = imagesArray.map((image, index) => ({
          id: idsArray[index].trim(),
          image: image.trim(),
        }));

        setShowimage(resultArray);
      } catch (error) {
        console.log("Error fetching article:", error);
      }
    };
    getBreedNames();
    fetchCategory();
  }, [id]);

  const handleAddBreed = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryid", categoryid);
    images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const res = await api.put(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/updatebreedwithimage/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      console.log("Check breed response", res);
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/breeds");
      } else {
        toast.error("Failed to add Breed. Please check the provided data.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to add Breed. Please check the provided data.");
    }
  };
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  };

  const handleDeleteImage = async (id) => {
    const stringId = id.toString();
    const imageToDelete = showimage.find((image) => image.id === stringId);

    if (!imageToDelete) {
      toast.error(`Image not found. Refresh the page to sync with the server.`);
    }
    try {
      const res = await api.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/deleteimage/${id}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setShowimage((prevImages) =>
        prevImages.filter((image) => image.id !== stringId)
      );

      console.log("res delete", res);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        toast.error(`Image not found on the server.`);
      } else {
        toast.error("Failed to delete image. Please try again.");
      }
    }
  };

  return (
    <div className="midde_cont">
      <div className="container-fluid1">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Edit Breed</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <div className="flex items-center gap-4 flex-wrap">
                  {showimage.map((image) => (
                    <div className="relative w-fit" key={image.id}>
                      <img
                        src={`${import.meta.env.VITE_APP_BASE_URL}/${
                          image.image
                        }`}
                        className="w-32 h-32 rounded-md object-cover "
                      />
                      <button
                        className="bg-red-500 hover:scale-150 transition-all p-2 rounded-full text-white absolute top-1 right-1"
                        onClick={() => {
                          handleDeleteImage(Number(image.id));
                        }}
                      >
                        <FaTrash className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddBreed}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="field margin_0">
                        <label className="label_field">Image</label>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="form-control"
                          accept="image/*"
                          multiple
                          name="images"
                        />
                      </div>
                      <div className="field margin_0">
                        <label className="label_field">Breeds Category</label>
                        <select
                          name="categoryid"
                          id="breed category"
                          className="form-control"
                          onChange={(e) => setCategoryId(e.target.value)}
                          value={categoryid}
                        >
                          <option value="" disabled>
                            Select Breed Category
                          </option>
                          {breeds.map((breed) => (
                            <option key={breed.id} value={breed.id}>
                              {breed.title}
                            </option>
                          ))}
                        </select>
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
                  <div className="row pr-[10px]">
                    <button
                      type="submit"
                      className="px-4 py-3 w-fit my-4 rounded-md bg-blue-500 text-white ml-auto"
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
export default EditBreeds;
