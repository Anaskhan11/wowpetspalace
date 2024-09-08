import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";

const ShowShops = () => {
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [shopToDelete, setShopToDelete] = useState(null); // State to store shop to be deleted

  const fetchShops = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/shop/getshops`
    );
    console.log("=========================");
    console.log(response.data.result);
    console.log("=========================");
    setShops(response.data.result);
  };
  useEffect(() => {
    fetchShops();
  }, []);

  const handleDelete = (id) => {
    setShopToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (shopToDelete) {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/shop/deleteshop/${shopToDelete}`
      );
      fetchShops();
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Shops Details</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <div className="full graph_head flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Shop Details List</h2>

                  <div className="field margin_0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/addtags"
                        className="px-4 py-3 rounded-md bg-red-400 text-white"
                      >
                        Add Tags
                      </Link>
                      <Link
                        to="/addshop"
                        className="px-4 py-3 rounded-md bg-green-600 text-white"
                      >
                        Add more shops
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="full price_table padding_infor_info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shops.map((data, index) => (
                      <div
                        key={index}
                        className="border rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-blue-700">
                            {data.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/productdetails/${data.id}`}
                              className="rounded-full p-2 bg-green-500 text-white flex items-center justify-center"
                            >
                              <FaEye className="w-6 h-6" />
                            </Link>
                            <Link
                              to={`/editshop/${data.id}`}
                              className="rounded-full p-2 bg-yellow-500 text-white flex items-center justify-center"
                            >
                              <FaPenToSquare className="h-6 w-6" />
                            </Link>
                            <button
                              type="button"
                              className="bg-red-500 rounded-full p-2 text-white flex items-center justify-center"
                              onClick={() => handleDelete(data.id)}
                            >
                              <FaTrash className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}/${
                            data.img_paths[1]
                          }`} // Assuming `coverPhoto` is a field in your shop data
                          alt="Shop Cover"
                          className="w-full h-32 object-cover mb-4"
                        />
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Address:</strong> {data.address1 || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Email:</strong> {data.email}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>About Shop:</strong> {data.description}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <div>
                            <strong>Categories:</strong> {data.categories || 0}
                          </div>
                          <div>
                            <strong>Subcategories:</strong>{" "}
                            {data.subcategories || 0}
                          </div>
                          <div>
                            <strong>Products:</strong> {data.products || 0}
                          </div>
                        </div>
                      </div>
                    ))}
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
      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p>Are you sure you want to delete this shop?</p>
            <div className="mt-4 flex justify-center">
              <button
                className="bg-red-500 text-white px-4 py-2 mr-4 rounded"
                onClick={() => confirmDelete()}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowShops;
