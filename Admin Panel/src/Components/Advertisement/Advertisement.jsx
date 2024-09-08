import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

import Pagination from "../Pagination/Pagination";
// ICONS

import { FaPenToSquare } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";

const Advertisement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [advertisementToDelete, setAdvertisementToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [advertisementToEdit, setAdvertisementToEdit] = useState(null);
  const [editStatus, setEditStatus] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };

  const confirmEdit = async (id, editStatus) => {
    console.log("Edit Status: ", editStatus);
    console.log("id", id);
    try {
      const res = await api.put(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/advertisment/updateadvertisementstatus/${id}`,
        { status: editStatus }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchAdvertisement();
        setShowEditModal(false);
      } else {
        toast.error(res.data.message || "Failed to update Advertisement.");
      }
    } catch (error) {
      toast.error("Failed to update Advertisement.", error);
    }
  };

  const fetchAdvertisement = async () => {
    try {
      const res = await api.get(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/advertisement/getadvertisement/${page}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      console.log(res.data, "Check advertisement");
      console.log(
        res.data.data[0].imagePaths.split(",")[0],
        "Check advertisement"
      );
      setAdvertisements(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdvertisement();
  }, [page]);

  const handleDelete = async (id) => {
    setAdvertisementToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/advertisement/deleteadvertisement/${advertisementToDelete}`,
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
        fetchAdvertisement();
        setAdvertisementToDelete(null);
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to delete Advertisement.");
      }
    } catch (error) {
      toast.error("Failed to delete Advertisement.", error);
    }
  };
  const handleClose = () => {
    setAdvertisementToDelete(null);
    setShowModal(false);
    setShowEditModal(false);
  };

  const handelEdit = (id) => {
    const fetchAdvertisementbyId = async () => {
      try {
        const res = await api.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/advertisement/getadvertisementbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${secureLocalStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        setAdvertisementToEdit(res.data[0]);

        setEditStatus(res.data[0].status);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdvertisementbyId();
    setShowEditModal(true);
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Advertisements</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head  flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Advertisements List </h2>
                </div>
                <div className="full price_table padding_infor_info">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive-sm">
                        <table className="table table-striped projects">
                          <thead className="thead-dark">
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Breeds Category </th>
                              <th>Price </th>
                              <th>Address </th>
                              <th>Latitude </th>
                              <th> Longitude </th>
                              <th>City </th>
                              <th>Status </th>
                              <th>Action </th>
                            </tr>
                          </thead>
                          <tbody>
                            {advertisements.map((data) => (
                              <>
                                <tr key={data.id}>
                                  <td>
                                    <img
                                      src={`${
                                        import.meta.env.VITE_APP_BASE_URL
                                      }/${data?.imagePaths.split(",")[0]}`}
                                      className="h-16 w-16 rounded-full object-cover"
                                      alt={data.title}
                                    />
                                  </td>
                                  <td>{data.title}</td>
                                  <td>{data.description.slice(0, 100)}</td>
                                  <td>{data.category_title}</td>
                                  <td>{data.price}</td>
                                  <td>{data.address}</td>
                                  <td>{data.latitude}</td>
                                  <td>{data.longitude}</td>
                                  <td>{data.city}</td>
                                  <td
                                    className={
                                      data.status === 0
                                        ? "!text-red-500"
                                        : "!text-green-500"
                                    }
                                  >
                                    {data.status === 0 ? "inactive" : "Active"}
                                  </td>

                                  <td className="flex items-center gap-2">
                                    <Link
                                      to={`/advertisement/${data.id}`}
                                      className=" bg-blue-500 text-white p-2 rounded-full flex items-center justify-center"
                                      state={{ data: data }}
                                    >
                                      <FaEye className="w-6 h-6" />
                                    </Link>
                                    <button
                                      onClick={() => handelEdit(data.id)}
                                      type="button"
                                      className="bg-yellow-400 text-white p-2 rounded-full flex items-center justify-center"
                                      style={{ marginRight: "5px" }} // Adjust the value as needed
                                    >
                                      <FaPenToSquare className="w-6 h-6" />
                                    </button>
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
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        currentPage={page}
                        setPage={setPage}
                        pages={totalPages}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Model for Updating Should Contain Selecting Status from data and one button for Conform Edit  */}
      <Modal show={showEditModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Advertisement Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={editStatus}
              onChange={(e) => handleStatusChange(e)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-slate-500 border-none text-white px-4 py-3"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            className="bg-green-500 border-none text-white px-4 py-3"
            onClick={() => confirmEdit(advertisementToEdit.id, editStatus)}
          >
            Yes, Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Model for deleting */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Advertisement?
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
export default Advertisement;
