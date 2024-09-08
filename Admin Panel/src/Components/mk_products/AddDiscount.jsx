import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddDiscount = () => {
  const { shopId } = useParams();

  const [showProduct, setShowProduct] = useState([]);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [isPublish, setIsPublish] = useState(0);
  const [image, setImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [tableProduct, setTableProduct] = useState({});

  const discountProduct = async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_BASE_URL
      }/product/getDiscountProduct/${shopId}`
    );
    console.log(
      response.data.result,
      "checking response discount page===================="
    );
    setTableProduct(response.data.result);
  };

  // Fetch products by shopId
  const fetchProducts = async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_BASE_URL
      }/product/getallproductbyShopId/${shopId}`
    );
    console.log(response.data.result, "checking response discount page");
    setShowProduct(response.data.result);
  };

  useEffect(() => {
    fetchProducts();
    discountProduct();
  }, []);

  // Function to handle checkbox selection for products
  const handleCheckboxChange = (productId) => {
    setSelectedProduct((prevSelected) => {
      if (prevSelected.includes(productId)) {
        // If already selected, remove the productId from the array
        return prevSelected.filter((id) => id !== productId);
      } else {
        // Otherwise, add the productId to the array
        return [...prevSelected, productId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("shop_id", shopId);
    formData.append("name", name);
    formData.append("discount", discount); // Match 'percent' in the backend
    formData.append("isPublish", isPublish); // Match 'status' in the backend
    formData.append("image", image);
    formData.append("productId", JSON.stringify(selectedProduct)); // Sending array as JSON string

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/product/createDiscount`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Discount added successfully:", response.data);
      if (response.data.message === "Discount created successfully") {
        toast.success(response.data.message);
        discountProduct();
      }
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("shop_id", shopId);
  //   formData.append("name", name);
  //   formData.append("discount", discount); // Match 'percent' in the backend
  //   formData.append("isPublish", isPublish); // Match 'status' in the backend
  //   formData.append("image", image);
  //   formData.append("productId", selectedProduct); // Match 'product_id'

  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_APP_BASE_URL}/product/createDiscount`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("Discount added successfully:", response.data);
  //     if (response.data.message === "Discount created successfully") {
  //       toast.success(response.data.message);
  //       discountProduct();
  //     }
  //   } catch (error) {
  //     console.error("Error adding discount:", error);
  //   }
  // };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 mt-16">
      <h2 className="text-xl font-bold mb-4 bg-cyan-500 text-white p-2">
        Discount Information
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">
              <span className="text-red-500">*</span> Discount Name
            </label>
            <input
              type="text"
              className="w-full border p-2"
              placeholder="Discount Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isPublish}
              onChange={(e) => setIsPublish(e.target.checked ? 1 : 0)}
            />
            <label>Status(Is Publish?)</label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">
              <span className="text-red-500">*</span> Discount Percent(%)
            </label>
            <input
              type="number"
              className="w-full border p-2"
              placeholder="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">
              <span className="text-red-500">*</span> Discount Photo
            </label>
            <input
              type="file"
              className="w-full border p-2"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <select className="border rounded p-1">
            <option>Show 10 entries</option>
          </select>
          <input placeholder="Search" className="p-2 border rounded" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-12 p-2 border">
                  <input type="checkbox" />
                </th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Price($)($)</th>
              </tr>
            </thead>
            <tbody>
              {showProduct.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={selectedProduct.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.code}</td>
                  <td className="p-2 border">{product.original_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Save
          </button>
          <button type="button" className="bg-gray-300 px-4 py-2">
            Cancel
          </button>
        </div>
      </form>

      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">No</th>
            <th className="py-3 px-6 text-left">Discount Name</th>
            <th className="py-3 px-6 text-left">Discount Percent(%)</th>
            <th className="py-3 px-6 text-center">Edit</th>
            <th className="py-3 px-6 text-center">Delete</th>
            <th className="py-3 px-6 text-center">Publish</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {Array.isArray(tableProduct) &&
            tableProduct.map((discount, index) => (
              <tr
                key={discount.id}
                className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
              >
                <td className="py-4 px-6 text-left text-lg font-medium text-gray-700 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-4 px-6 text-left text-lg font-medium text-gray-700">
                  {discount.name}
                </td>
                <td className="py-4 px-6 text-left text-lg font-medium text-gray-700">
                  {discount.percent}%
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition duration-150">
                    Edit
                  </button>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-red-600 hover:text-red-800 font-semibold text-lg transition duration-150">
                    Delete
                  </button>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    className={`py-2 px-4 rounded-full text-sm font-semibold transition duration-150 ${
                      discount.status
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-gray-800"
                    }`}
                  >
                    {discount.status ? "Yes" : "No"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddDiscount;
