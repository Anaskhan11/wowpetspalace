import { useState, useEffect } from "react";
import axios from "axios";
const AdvertisementForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.0");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("Select a status");
  const [views, setViews] = useState("0.0");
  const [verfied, setVerified] = useState("0");
  const [healthcheck, setHealth] = useState("0");
  const [breeds, setBreeds] = useState([]);
  const [categoryid, setCategoryid] = useState("");
  const [advertisementtype, setAdvertisementtype] = useState("1");
  const [images, setImages] = useState([]);
  // useEffect
  useEffect(() => {
    axios.get("http://localhost:4000/breed/getbreed").then((response) => {
      setBreeds(response.data);
    });
  }, []);

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("address", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("city", city);
    formData.append("status", status);
    formData.append("views", views);
    formData.append("verfied", verfied);
    formData.append("healthcheck", healthcheck);
    formData.append("categoryid", categoryid);
    formData.append("advertisementtype", advertisementtype);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    await axios
      .post(
        "http://localhost:4000/advertisment/createAdvertiserment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
      });
  };
  return (
    <div className="flex items-center justify-center">
      <form
        className="w-full lg:w-2/3 md:w-2/3 sm:w-full mx-auto p-4 rounded-md bg-green-50 shadow-sm shadow-slate-900 my-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-green-900 my-8">
          Create a new Advertisement.
        </h1>
        <input
          type="file"
          name="images"
          multiple
          className="block my-4"
          onChange={handleImageChange}
        />
        <div className="grid grid-cols-3 gap-2">
          <label>
            <span>Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            <span>City:</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            <span>Breed Category:</span>
            <select
              value={categoryid}
              onChange={(e) => setCategoryid(e.target.value)}
            >
              <option value="Select a Category" disabled>
                Select a status
              </option>
              {breeds.map((breed) => (
                <option value={breed.id}>{breed.title}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label>
            <span>Status:</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Select a status" disabled>
                Select a status
              </option>
              <option value="0">Active</option>
              <option value="1">Inactive</option>
            </select>
          </label>
          <label>
            <span>Price:</span>
            <input
              type="Number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label>
            <span>address:</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
        </div>
        <label>
          <span>Description:</span>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20 rounded-md p-2 w-full"
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label>
            <span>Latitude:</span>
            <input
              type="Number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </label>
          <label>
            <span>Longitude:</span>
            <input
              type="Number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </label>
          <label>
            <span>Views:</span>
            <input
              type="Number"
              value={views}
              onChange={(e) => setViews(e.target.value)}
            />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label>
            <span>Verified:</span>
            <select
              value={verfied}
              onChange={(e) => setVerified(e.target.value)}
            >
              <option value="0">Yes</option>
              <option value="1">No</option>
            </select>
          </label>
          <label>
            <span>Health:</span>
            <select
              value={healthcheck}
              onChange={(e) => setHealth(e.target.value)}
            >
              <option value="0">Yes</option>
              <option value="1">No</option>
            </select>
          </label>
          <label>
            <span>Type:</span>
            <select
              value={advertisementtype}
              onChange={(e) => setAdvertisementtype(e.target.value)}
            >
              <option value="1">For Sale</option>
              <option value="2">For Adoption</option>
            </select>
          </label>
        </div>
        <button className="px-6 py-4 rounded-md bg-blue-600 text-white font-semibold">
          Submit
        </button>
      </form>
    </div>
  );
};
export default AdvertisementForm;
