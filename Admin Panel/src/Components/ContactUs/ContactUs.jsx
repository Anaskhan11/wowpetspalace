import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DescriptionComponent from "../DestructureTextFromJSX/StringhtmlToText";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import axios from "axios";

// ICONS
import { FaEye, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  // Modals visibility
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  // Form data
  const [categoryTitle, setCategoryTitle] = useState("");
  const [reasonTitle, setReasonTitle] = useState("");

  // Delete Modal visibility
  const [showModal, setShowModal] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/getContactUs/`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setContacts(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContactCategory = async (e) => {
    e.preventDefault();
    // Implement API call to add category, similar to your current approach
    const formData = { title: categoryTitle };
    axios
      .post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/createContactUsCategory`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/contact us", { replace: true });
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error adding contact category", error);
        toast.error("Failed to add contact category. Please try again.");
      });
    setShowCategoryModal(false);
  };

  // Handlers for Reason
  const handleAddContactReason = async (e) => {
    e.preventDefault();
    // Implement API call to add reason, similar to your current approach
    const formData = { title: reasonTitle };
    axios
      .post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/createContactUsReason`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/contact us", { replace: true });
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error adding contact reason", error);
        toast.error("Failed to add contact reason. Please try again.");
      });

    setShowReasonModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const confirmDelete = () => {
    // Implement API call to delete term, similar to your current approach

    console.log("Term to delete", termToDelete);
    axios
      .delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/contact/deleteContactUs/${termToDelete}`
      )
      .then((res) => {
        console.log(res.data);
        fetchContacts();
        navigate("/contact us", { replace: true });
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error deleting contact", error);
        toast.error("Failed to delete contact. Please try again.");
      });

    setShowModal(false);
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Contact Us</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head  flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Contact Us Entries</h2>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => setShowCategoryModal(true)}
                      className="bg-blue-500"
                    >
                      Add Contact Category
                    </Button>

                    {/* Button to open add reason modal */}
                    <Button
                      onClick={() => setShowReasonModal(true)}
                      className="bg-blue-500"
                    >
                      Add Contact Reason
                    </Button>
                  </div>
                </div>
                <div className="full price_table padding_infor_info">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive-sm">
                        <table className="table  table-striped projects">
                          <thead className="thead-dark">
                            <tr>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Address 1</th>
                              <th>Address 2</th>
                              <th>City </th>
                              <th>State</th>
                              <th>Zip Code</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contacts.map((contact) => (
                              <tr key={contact.id}>
                                <td>{contact.FirstName}</td>
                                <td>{contact.LastName}</td>
                                <td>{contact.Address1}</td>
                                <td>{contact.Address2}</td>
                                <td>{contact.city}</td>
                                <td>{contact.state}</td>
                                <td>{contact.zipCode}</td>
                                <td>{contact.email}</td>
                                <td>{contact.status}</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setTermToDelete(contact.id);
                                      setShowModal(true);
                                    }}
                                    className="p-2 rounded-md bg-slate-50 shadow-sm shadow shadow-slate-200"
                                  >
                                    <FaTrash className="text-red-500 h-8 w-8" />
                                  </button>
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
        <Modal.Body>Are you sure you want to delete this term?</Modal.Body>
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

      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        centered
      >
        {/* Modal Content for Adding Category */}
        <form
          onSubmit={handleAddContactCategory}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <div className="text-lg font-semibold mb-4">Add Contact Category</div>
          <input
            type="text"
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
            className="form-input mt-1 block w-full px-3 py-2 border rounded-md text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {/* Adjust the button class to make it look more appealing */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Submit Category
          </button>
        </form>
      </Modal>

      <Modal
        show={showReasonModal}
        onHide={() => setShowReasonModal(false)}
        centered
      >
        {/* Modal Content for Adding Category */}
        <form
          onSubmit={handleAddContactReason}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <div className="text-lg font-semibold mb-4">Add Contact Reason</div>
          <input
            type="text"
            value={reasonTitle}
            onChange={(e) => setReasonTitle(e.target.value)}
            className="form-input mt-1 block w-full px-3 py-2 border rounded-md text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {/* Adjust the button class to make it look more appealing */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Submit Reason
          </button>
        </form>
      </Modal>
    </>
  );
};
export default ContactUs;
