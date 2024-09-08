import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

// ICONS
import { FaEye } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import Pagination from "../Pagination/Pagination";
import DescriptionComponent from "../DestructureTextFromJSX/StringhtmlToText";

const ShowArticles = () => {
  // state for showing articles
  const [article, setArticle] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/article/getarticles/${page}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setArticle(res.data.articles);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [page]);

  const handleDelete = async (id) => {
    setArticleToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/article/deletearticle/${articleToDelete}`,
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

        const updatedArticle = article.filter(
          (art) => art.id !== articleToDelete
        );
        setArticle(updatedArticle);
        setArticleToDelete(null);
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to delete Article.");
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
      <div className="midde_cont w-full">
        <div className="container-fluid w-full">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Articles Page</h2>
              </div>
            </div>
          </div>
          <div>
            <div className="field margin_0 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Article List</h1>
              <div className="flex items-center gap-2">
                <Link
                  to="/addtags"
                  className="px-4 py-3 rounded-md bg-red-400 text-white"
                >
                  Add Tags
                </Link>
                <Link
                  to="/addarticle"
                  className="px-4 py-3 rounded-md bg-green-600 text-white"
                >
                  Add Article
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
                          <th>Category</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {article.map((data) => (
                          <tr key={data.id}>
                            <td>
                              <img
                                src={`${import.meta.env.VITE_APP_BASE_URL}/${
                                  data.image
                                }`}
                                className="h-16 w-16 rounded-full object-cover"
                                alt={data.title}
                              />
                            </td>
                            <td>{data.title}</td>
                            {/* <td>{data.description.slice(0, 100)}</td> */}
                            <td>
                              <DescriptionComponent
                                description={data.description}
                              />
                            </td>
                            <td>{data.categoryName}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/detailpage`}
                                  state={{ data }}
                                  type="button"
                                  className="bg-blue-500 p-2 rounded-full text-white flex items-center justify-center"
                                >
                                  <FaEye className="w-6 h-6" />
                                </Link>
                                <Link
                                  to={`/editarticle/${data.id}`}
                                  type="button"
                                  className="bg-yellow-500 rounded-full  text-white p-2 flex items-center justify-center"
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

export default ShowArticles;
