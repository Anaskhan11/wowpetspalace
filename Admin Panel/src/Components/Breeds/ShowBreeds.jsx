import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import Pagination from "../Pagination/Pagination";

const ShowBreeds = () => {
  const [breed, setBreed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [breedToDelete, setBreedToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchBreeds = () => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL}/breed/showallbreed/${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch breeds.");
        }
        return response.json();
      })
      .then((data) => {
        setBreed(data.data);
        console.log("==================", data.status);
        if (!data) {
          navigate("/");
        }
        console.log("-=-=-=-=-=-=-==-==", data);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchBreeds();
  }, [page]);

  const handleDelete = async (breed_id) => {
    setBreedToDelete(breed_id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/breed/deletebreed/${breedToDelete}`,
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
        fetchBreeds();
        setBreedToDelete(null);
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to delete Breeds.");
      }
    } catch (error) {
      toast.error("Failed to delete Breeds.", error);
    }
  };

  const handleClose = () => {
    setBreedToDelete(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Breeds</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head  flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Breeds List </h2>

                  <div className="flex items-center gap-4 justify-end">
                    <Link
                      to="/addbreedtags"
                      className="px-4 py-3 rounded-md text-white bg-blue-600 flex items-center gap-2 w-fit"
                    >
                      <IoMdAddCircleOutline className="h-6 w-6" />
                      <span>Add Tags</span>
                    </Link>
                    <Link
                      to="/addbreeds"
                      className="px-4 py-3 rounded-md text-white bg-green-600 flex items-center gap-2 w-fit"
                    >
                      <IoMdAddCircleOutline className="h-6 w-6" />
                      <span>Add Breeds</span>
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
                              <th>Description</th>
                              <th>Breeds Category </th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {breed.map((data) => (
                              <tr key={data.id}>
                                <td>
                                  <img
                                    src={`${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/${data.breed_images[0]}`}
                                    className="h-16 w-16 rounded-full object-cover"
                                    alt={data.title}
                                  />
                                </td>
                                <td>{data.breed_title}</td>
                                {/* <td>
                                    {data.breed_description.slice(0, 100)}
                                  </td> */}
                                <DescriptionComponent
                                  description={data.breed_description}
                                />
                                <td>{data.category_title}</td>
                                <td className="flex items-center gap-2">
                                  <Link
                                    to={`/detailpage`}
                                    state={{ data: data }}
                                    type="button"
                                    className="rounded-full p-2 bg-blue-500  text-white flex items-center justify-center"
                                  >
                                    <FaEye className="h-6 w-6" />
                                  </Link>
                                  <Link
                                    to={`/editsinglebreed/${data.breed_id}`}
                                    type="button"
                                    className="rounded-full p-2 bg-yellow-500  text-white flex items-center justify-center"
                                  >
                                    <FaPenToSquare className="h-6 w-6" />
                                  </Link>
                                  <button
                                    type="button"
                                    className=" bg-red-500 rounded-full p-2 text-white flex items-center justify-center"
                                    onClick={() => {
                                      handleDelete(data.breed_id);
                                    }}
                                  >
                                    <FaTrash className="h-6 w-6" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        currentPage={page}
                        pages={totalPages}
                        setPage={setPage}
                      />
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
        <Modal.Body>Are you sure you want to delete this article?</Modal.Body>
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
export default ShowBreeds;
