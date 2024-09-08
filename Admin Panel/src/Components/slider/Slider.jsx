import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import DescriptionComponent from "../DestructureTextFromJSX/StringhtmlToText";

import axios from "axios";

// ICONS
import { FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [defaultSlider, setDefaultSlider] = useState(0);

  // delete image
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/slider/deleteSlider/${id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchImages();
      }
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  // fetch all images
  const fetchImages = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/slider/getallimages`
    );
    setImages(response.data);
    console.log(response.data);
  };
  // useEffect
  useEffect(() => {
    fetchImages();
    console.log("images");
  }, []);

  const handleEdit = (id) => {
    const image = images.find((image) => image.id === id);
    setCurrentImage(image);
    setTitle(image.title);
    setDescription(image.description);
    setDate(image.expiryDate);
    setUrl(image.url);
    setStatus(image.status);
    setShowModal(true);
    setDefaultSlider(image.defaultSlider);
  };

  const handleClose = () => setShowModal(false);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("defaultSlider", defaultSlider);
    formData.append("expiryDate", date);
    formData.append("url", url);
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }
    // Implement your update logic here
    const response = await axios.put(
      `${import.meta.env.VITE_APP_BASE_URL}/slider/updateSlider/${
        currentImage.id
      }`,
      formData
    );
    console.log(response, "check Data");
    fetchImages();
    // After updating, close the modal

    handleClose();
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Slider</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head  flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Slider Images</h2>

                  <div className="field margin_0">
                    <Link
                      to="/addslider"
                      className="px-4 py-3 rounded-md text-white bg-green-600 flex items-center gap-2 w-fit"
                    >
                      <IoMdAddCircleOutline className="h-6 w-6" />
                      <span>Slider Images</span>
                    </Link>
                  </div>
                </div>
                <div className="full price_table padding_infor_info">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive-sm">
                        <table className="table  table-striped projects">
                          <thead className="thead-dark">
                            <tr>
                              <th>id</th>
                              <th>Image</th>
                              <th>title</th>
                              <th>Description</th>
                              <th>Status</th>
                              <th>URL</th>
                              <th>Current Date</th>
                              <th>Expiry Date</th>
                              <th>Default Slider</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {images.map((data, index) => (
                              <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>
                                  <img
                                    src={`${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/${data.images}`}
                                    className="h-16 w-16 rounded-full object-cover"
                                    alt={data.images}
                                  />
                                </td>
                                <td>{data.title}</td>
                                <td>
                                  <DescriptionComponent
                                    description={data.description}
                                  />
                                </td>
                                <td
                                  style={{
                                    color: data.status === 1 ? "green" : "red",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {data.status === 1 ? "Active" : "Inactive"}
                                </td>
                                <td>{data.url}</td>
                                <td>{data.currentDate}</td>
                                <td>{data.expiryDate}</td>
                                <td>
                                  {/* {setDefaultSlider(data.defaultSlider)} */}
                                  {data.defaultSlider === 1
                                    ? "check"
                                    : "unCheck"}
                                </td>
                                <div className="flex items-center gap-1">
                                  <td className="flex items-center">
                                    <Link
                                      type="button"
                                      className=" bg-blue-800 rounded-full p-2 text-white flex items-center justify-center"
                                      onClick={() => {
                                        handleEdit(data.id);
                                      }}
                                    >
                                      <CiEdit className="h-6 w-6" />
                                    </Link>
                                  </td>
                                  <td className="flex items-center">
                                    <button
                                      type="button"
                                      className=" bg-red-500 rounded-full p-2 text-white flex items-center justify-center"
                                      onClick={() => {
                                        handleDelete(data.id);
                                      }}
                                    >
                                      <FaTrash className="h-6 w-6" />
                                    </button>
                                  </td>
                                </div>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setSelectedImages(e.target.files)}
              />
            </Form.Group>

            <div className="field margin_0 bg-slate-200 border border-gray-800 p-2 mt-4">
              <label className="label_field">Default Slider</label>
              <input
                type="checkbox"
                name="defaultSlider"
                value={defaultSlider}
                onChange={(e) => {
                  console.log(defaultSlider);
                  setDefaultSlider(defaultSlider === 0 ? 1 : 0);
                }}
                className="block h-5 w-5"
                required
                checked={defaultSlider === 1 ? true : false}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-blue-500 text-white" onClick={handleClose}>
            Close
          </Button>
          <Button className="bg-gray-800 text-white" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Slider;
