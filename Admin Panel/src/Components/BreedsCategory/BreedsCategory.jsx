import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DescriptionComponent from "../DestructureTextFromJSX/StringhtmlToText";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

// ICONS
import { FaEye } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";

const BreedsCategory = () => {
  // state for breeds category
  const [breed, setBreed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/getbreed`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setBreed(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDelete = async (id) => {
    setArticleToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/breed/deletebreedcategory/${articleToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      console.log("Checking Deleting response", res);
      if (res.data.success) {
        toast.success(res.data.message);

        fetchCategory();
        setArticleToDelete(null);
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to delete Breeds Category .");
      }
    } catch (error) {
      console.error("Error Breeds Category deleting :", error.message);
      toast.error("Failed to delete Breeds Category.");
    }
  };

  const handleClose = () => {
    setArticleToDelete(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Breeds Category</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head flex items-center justify-between">
                  <h2 className="text-2xl font-bold"> Breed Category List </h2>

                  <div className="field margin_0">
                    <Link
                      to="/createbreedscategory"
                      className="px-4 py-3 bg-green-600 rounded-md text-white flex items-center gap-2"
                    >
                      <IoMdAddCircleOutline className="w-6 h-6" />
                      <span>Add</span>
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
                              <th>Image</th>
                              <th>Title</th>
                              <th>Decription</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {breed.map((data) => (
                              <tr key={data.categoryid}>
                                <td>
                                  <img
                                    src={`${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/${data.image}`}
                                    className="w-16 h-16 object-cover rounded-full"
                                    alt={data.title}
                                  />
                                </td>

                                <td>{data.title}</td>
                                {/* <td>{data.description.slice(0, 100)}</td> */}
                                <DescriptionComponent
                                  description={data.description}
                                />
                                <td>
                                  <div className="flex items-center gap-2">
                                    <Link
                                      to={`/detailpage`}
                                      state={{ data: data }}
                                      type="button"
                                      className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center"
                                    >
                                      <FaEye className="w-6 h-6" />
                                    </Link>
                                    <Link
                                      to={`/editbreedcategory/${data.id}`}
                                      type="button"
                                      className="bg-yellow-500 text-white p-2 rounded-full flex items-center justify-center"
                                    >
                                      <FaPenToSquare className="w-6 h-6" />
                                    </Link>
                                    <button
                                      type="button"
                                      className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center"
                                      onClick={() => {
                                        handleDelete(data.id);
                                      }}
                                    >
                                      <FaTrash className="w-6 h-6" />
                                    </button>
                                  </div>
                                </td>
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

      {/* Modal for delete confirmation */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Breeds Category ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-slate-500 border-none text-white px-4 py-3"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            className="bg-red-500 border-none text-white px-4 py-3"
            onClick={confirmDelete}
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BreedsCategory;
