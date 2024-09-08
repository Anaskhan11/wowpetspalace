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
import { FaEye, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import Pagination from "../Pagination/Pagination";

const PrivacyPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchPolicies = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/privacyAndTermRoutes/getprivacy`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setPolicies(res.data.result);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [page]);

  const handleDelete = async (policy_id) => {
    setPolicyToDelete(policy_id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/privacyAndTermRoutes/deleteprivacy/${policyToDelete}`,
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
        fetchPolicies();
        setPolicyToDelete(null);
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to delete Policy.");
      }
    } catch (error) {
      toast.error("Failed to delete Policy.", error);
    }
  };

  const handleClose = () => {
    setPolicyToDelete(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Privacy Policies</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head  flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Privacy Policies List</h2>

                  <div className="field margin_0">
                    <Link
                      to="/addpolicy"
                      className="px-4 py-3 rounded-md text-white bg-green-600 flex items-center gap-2 w-fit"
                    >
                      <IoMdAddCircleOutline className="h-6 w-6" />
                      <span>Add Privacy Policy</span>
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
                              <th>Title</th>
                              <th>Description</th>
                              <th>Created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {policies.map((data) => (
                              <tr key={data.id}>
                                <td>{data.title}</td>
                                <td>
                                  <DescriptionComponent
                                    description={data.description}
                                  />
                                </td>
                                <td>{data.created_at}</td>
                                <td className="flex items-center gap-2">
                                  <Link
                                    to={`/editpolicy/${data.privacyid}`}
                                    type="button"
                                    className="rounded-full p-2 bg-yellow-500  text-white flex items-center justify-center"
                                  >
                                    <FaPenToSquare className="h-6 w-6" />
                                  </Link>
                                  <button
                                    type="button"
                                    className=" bg-red-500 rounded-full p-2 text-white flex items-center justify-center"
                                    onClick={() => {
                                      handleDelete(data.privacyid);
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
                      {/* <Pagination
                          currentPage={page}
                          pages={totalPages}
                          setPage={setPage}
                        /> */}
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
        <Modal.Body>Are you sure you want to delete this policy?</Modal.Body>
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
export default PrivacyPolicy;
