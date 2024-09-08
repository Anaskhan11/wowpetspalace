import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { PlusCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal"; // Make sure to import your Modal component
import { Link } from "react-router-dom";
import api from "../../axios/api";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { toast } from "react-toastify";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetails = ({ shopId }) => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Transactions",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Transactions",
      },
    },
  };

  const openSubCategoryModal = () => {
    setIsSubCategoryModalOpen(true);
  };

  const closeSubCategoryModal = () => {
    setIsSubCategoryModalOpen(false);
  };

  const fetchData = async () => {
    const res = await api.get(
      `${import.meta.env.VITE_APP_BASE_URL}/breed/breedshow`,
      {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("accessToken")}`,
        },
      }
    );

    setCategories(res.data);
  };

  const fetchSubCategory = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}/subCategory/getAllProductCategory`
      );

      console.log(res.data.result, "subcategories");
      if (Array.isArray(res.data.result)) {
        setSubCategories(res.data.result);
      } else {
        setSubCategories([]); // Handle unexpected data structure
      }
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
      setSubCategories([]); // Handle error by setting an empty array
    }
  };
  useEffect(() => {
    fetchData();
    fetchSubCategory();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/subCategory/createProductCategory`,
        {
          name,
          status,
          shop_id: shopId,
          cat_id: category,
        }
      );
      console.log("=========", response);
      if (response.status === 200) {
        toast.success(response.data.message);
        closeSubCategoryModal(); // Close the modal on successful submission
      }
    } catch (error) {
      toast.error(
        "Failed to Add Sub Category. Please check the provided data."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto mt-24">
        <div className="flex items-center justify-between my-6 gap-3">
          <h1 className="text-2xl font-semibold">Welcome, Shop!</h1>

          <Link
            to="/product_category"
            className="px-4 py-2 rounded-md bg-orange-600 ml-auto text-white flex items-center gap-2"
          >
            <PlusCircleIcon className="h-6 w-6" />
            <span>Add Category</span>
          </Link>
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white flex items-center gap-2"
            onClick={openSubCategoryModal}
          >
            <PlusCircleIcon className="h-6 w-6" />
            <span>Add Sub Category</span>
          </button>
          <Link
            to="/productlist"
            className="px-4 py-2 rounded-md bg-green-600 text-white flex items-center gap-2"
          >
            View Product
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-4 p-4 rounded-lg shadow">
            <div className="flex items-center bg-red-500 text-white p-2 rounded-lg shadow">
              <ShoppingBagIcon className="h-12 w-12 text-white mr-4" />
            </div>
            <div>
              <h2 className="text-sm text-blue-500 font-bold">Pending Order</h2>
              <p className="text-xl">0</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg shadow">
            <div className="flex items-center bg-teal-500 text-white p-2 rounded-lg shadow">
              <ShoppingBagIcon className="h-12 w-12 text-white mr-4" />
            </div>
            <div>
              <h2 className="text-sm text-blue-500 font-bold">
                Delivery Order
              </h2>
              <p className="text-xl">0</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg shadow">
            <div className="flex items-center bg-green-500 text-white p-2 rounded-lg shadow">
              <ShoppingBagIcon className="h-12 w-12 text-white mr-4" />
            </div>
            <div>
              <h2 className="text-sm text-blue-500 font-bold">
                Completed Order
              </h2>
              <p className="text-xl">0</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg shadow">
            <div className="flex items-center bg-blue-500 text-white p-2 rounded-lg shadow">
              <ShoppingBagIcon className="h-12 w-12 text-white mr-4" />
            </div>
            <div>
              <h2 className="text-sm text-blue-500 font-bold">Total Order</h2>
              <p className="text-xl">0</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-2">
              Purchased Product Information
            </h2>
            <div className="border-t border-gray-200 pt-2">
              {/* Purchased Product Information Content goes here */}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-2">Monthly Transactions</h2>
            <div className="border-t border-gray-200 pt-2">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Sub Category Modal */}
      <Modal isOpen={isSubCategoryModalOpen} onClose={closeSubCategoryModal}>
        <form
          className="space-y-4 h-[80vh] overflow-y-auto p-4"
          onSubmit={handleCategorySubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Category Name
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Sub Category Name
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Enter Sub Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductDetails;
