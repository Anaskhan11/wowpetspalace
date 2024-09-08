import { useEffect, useState } from "react";
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

const ShowCategory = () => {
  // state for articles
  const [article, setArticle] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const res = await api.get(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/categoryarticle/showcategoryarticle`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setArticle(res.data);
      console.log("Checking Articles", res);
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
        }/categoryarticle/deletecategory/${articleToDelete}`,
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
        toast.error(res.data.message || "Failed to delete Category Article.");
      }
    } catch (error) {
      console.error("Error deleting Article:", error.message);
      toast.error("Failed to delete Article.");
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
                <h2>Category Articles</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Category List</h2>

                  <div className="field margin_0">
                    <Link
                      to="/addcategory"
                      className="px-4 py-3 rounded-md bg-green-600 text-white flex items-center gap-2 w-fit"
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
                        <table className="table table-striped projects">
                          <thead className="thead-dark">
                            <tr className>
                              <th>Image</th>
                              <th>Category Name</th>
                              <th>Decription</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {article.map((data) => (
                              <tr key={data.categoryid}>
                                <td>
                                  <img
                                    src={`${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/${data.image}`}
                                    className="h-16 w-16 rounded-full object-cover"
                                    alt={data.title}
                                  />
                                </td>

                                <td>{data.categoryName}</td>
                                {/* <td>{data.description}</td> */}
                                <td>
                                  <DescriptionComponent
                                    description={data.description}
                                  />
                                </td>
                                <td className="flex items-center gap-2">
                                  <Link
                                    to={`/detailpage`}
                                    state={{ data }}
                                    type="button"
                                    className="p-2 bg-blue-500 text-white rounded-full flex items-center justify-center"
                                  >
                                    <FaEye className="w-6 h-6" />
                                  </Link>
                                  <Link
                                    to={`/editcategory/${data.categoryid}`}
                                    type="button"
                                    className="p-2 bg-yellow-500 text-white rounded-full flex items-center justify-center"
                                  >
                                    <FaPenToSquare className="w-6 h-6" />
                                  </Link>
                                  <button
                                    type="button"
                                    className="p-2 bg-red-500 text-white rounded-full flex items-center justify-center"
                                    onClick={() => {
                                      handleDelete(data.categoryid);
                                    }}
                                  >
                                    <FaTrash className="w-6 h-6" />
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
        <Modal.Body>
          Are you sure you want to delete this Atricle Category ?
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

export default ShowCategory;
