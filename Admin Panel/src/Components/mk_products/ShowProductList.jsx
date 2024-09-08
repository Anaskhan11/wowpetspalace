import React, { useState, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal"; // Make sure to import your Modal component

import api from "../../axios/api";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";

const ShowProductList = ({ shopId }) => {
  console.log("shopId", shopId);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [originalPrice, setOriginalPrice] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [highlightInformation, setHighlightInformation] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(false);
  const [shippingCost, setShippingCost] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [productMeasurement, setProductMeasurement] = useState("");
  const [colors, setColors] = useState([{ id: 1, value: "#000000" }]);
  const [images, setImages] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);

  const [products, setProducts] = useState([]);

  // for Edit state
  const [productId, setProductId] = useState(null);

  const [showImages, setShowImages] = useState([]);

  const fetchImages = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/product/getProductImage/${id}`
      );

      console.log(response, "check images==============");
      setShowImages(response.data.images);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    setProductId(id);

    fetchImages(id);
    fetchProductById(id); // Fetch the product details
    setIsProductModalOpen(true);
  };

  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/product/productbyid/${id}`
      );
      const product = response.data.result;

      // Populate state with product details
      setCategory(product.cat_id);
      setSubCategory(product.sub_cat_id);
      setName(product.name);
      setDescription(product.description);
      setOriginalPrice(product.original_price);
      setSearchTag(product.search_tag);
      setHighlightInformation(product.highlight_information);
      setIsFeatured(product.is_featured);
      setIsAvailable(product.is_available);
      setCode(product.code);
      setStatus(product.status);
      setShippingCost(product.shipping_cost);
      setMinimumOrder(product.minimum_order);
      setProductUnit(product.product_unit);
      setProductMeasurement(product.product_measurement);
      setColors(
        product.colors.map((color, index) => ({ id: index + 1, value: color }))
      );
      setImages(product.images);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
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

  const fetchProducts = async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_BASE_URL
      }/product/getallproductbyShopId/${shopId}`
    );

    console.log(response.data.result, "checking response");
    setProducts(response.data.result);
  };
  useEffect(() => {
    fetchData();
    fetchSubCategory();
    fetchProducts();
  }, []);

  const handleColorChange = (id, value) => {
    const updatedColors = colors.map((color) =>
      color.id === id ? { ...color, value } : color
    );
    setColors(updatedColors);
  };

  const openProductModal = () => {
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setProductId(null); // Reset product ID when closing the modal
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
  };

  console.log("images here", showImages);

  const handleSubmit = async (e) => {
    console.log("3. handlesubmit for update function called");
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("shop_id", shopId);
      formData.append("cat_id", category);
      formData.append("sub_cat_id", subCategory);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("original_price", originalPrice);
      formData.append("search_tag", searchTag);
      formData.append("highlight_information", highlightInformation);
      formData.append("is_featured", isFeatured ? 1 : 0);
      formData.append("is_available", isAvailable ? 1 : 0);
      formData.append("code", code);
      formData.append("status", status ? 1 : 0);
      formData.append("added_user_id", 1); // Example user ID
      formData.append("shipping_cost", shippingCost);
      formData.append("minimum_order", minimumOrder);
      formData.append("product_unit", productUnit);
      formData.append("product_measurement", productMeasurement);
      colors.forEach((color, index) => {
        formData.append(`colors[${index}]`, color.value);
      });
      images.forEach((image) => {
        formData.append(`images`, image);
      });

      if (featuredImage) {
        console.log(featuredImage, "=================================");
        formData.append("featuredImage", featuredImage);
      }

      let response;

      if (productId) {
        console.log("we are commencing update operation");

        response = await axios.put(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/product/updateproduct/${productId}`,
          formData
        );
      } else {
        // If productId is not set, create a new product
        response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/product/createproduct`,
          formData
        );

        console.log(response, "=================================");
      }

      if (response.status === 200) {
        toast.success(
          productId
            ? "Product updated successfully"
            : "Product created successfully"
        );
        setIsProductModalOpen(false); // Close the modal
        fetchProducts();
      }
    } catch (error) {
      toast.error(
        productId
          ? "Failed to update product. Please check the provided data."
          : "Failed to create product. Please check the provided data."
      );
    }
  };

  const handleDelete = async (productId) => {
    console.log("1. handleDelete function called");
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/product/deleteproduct/${productId}`
      );
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteImages = async (imageId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/product/deleteproductimages/${imageId}`
      );
      toast.success("Image deleted successfully");
      // Update the local state to remove the deleted image
      setShowImages(showImages.filter((img) => img.image_id !== imageId));
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="p-8 mt-16">
      <div className="bg-white p-2 shadow rounded-lg">
        <nav className="text-sm text-gray-500 mb-4">
          <span>Dashboard</span> / <span>Products</span>
        </nav>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 rounded w-full"
          />
          <select className="border p-2 rounded w-full">
            <option>Select Category Name</option>
            {/* Add other options here */}
          </select>
          <select className="border p-2 rounded w-full">
            <option>Select Sub Category Name</option>
            {/* Add other options here */}
          </select>
          <input
            type="number"
            placeholder="From Price"
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="To Price"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Is Featured?
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Is Available?
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Is Discount?
          </label>
          <select className="border p-2 rounded w-full">
            <option>Select Order</option>
            {/* Add other options here */}
          </select>
          <div className="flex justify-end space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Search
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Reset
            </button>
          </div>
        </div>
        <div className="flex justify-end mb-4 gap-2">
          <Link
            className="px-4 py-2 rounded-md bg-blue-800 text-white flex items-center gap-2"
            to={`/discount/${shopId}`}
          >
            <PlusCircleIcon className="h-6 w-6" />
            <span>Add Discount</span>
          </Link>

          <button
            className="px-4 py-2 rounded-md bg-green-600 text-white flex items-center gap-2"
            onClick={openProductModal}
          >
            <PlusCircleIcon className="h-6 w-6" />
            <span>Add Products</span>
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">product image</th>
              <th className="py-2 px-4 border-b">Product Name</th>
              <th className="py-2 px-4 border-b">Category Name</th>
              <th className="py-2 px-4 border-b">Sub Category Name</th>
              <th className="py-2 px-4 border-b">Unit Price</th>
              <th className="py-2 px-4 border-b">Original Price</th>
              <th className="py-2 px-4 border-b">Edit</th>
              <th className="py-2 px-4 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  {product.id}
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  <img
                    className="w-16 h-16 rounded-md object-cover"
                    src={`${import.meta.env.VITE_APP_BASE_URL}/${
                      product.images[0]
                    }`}
                    alt={product.name}
                  />
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  {product.name}
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  {product.categoryTitle}
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  {product.subCategory}
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  {product.product_unit}
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  {product.original_price}
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  <button
                    className="text-blue-500"
                    onClick={() => handleEdit(product.id)}
                  >
                    ✏️
                  </button>
                </td>
                <td className="py-4 px-4 border-b h-20 align-middle">
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isProductModalOpen} onClose={closeProductModal}>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 h-[80vh] overflow-y-auto p-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Product Name
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {showImages.map((item) => (
                <div className="relative w-24 h-24" key={item.image_id}>
                  <img
                    className="w-full h-full object-cover"
                    src={`${import.meta.env.VITE_APP_BASE_URL}/${item.image}`}
                    alt=""
                  />
                  <button
                    type="button" // Add this to prevent form submission
                    className="absolute top-1 right-1 text-red-500 hover:text-blue-800"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handleDeleteImages(item.image_id);
                    }}
                  >
                    <FaTrash className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Original Price
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Product Images
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
              />
            </div>
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
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
                className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
              >
                <option value="">Select a Sub Category</option>
                {subCategories.map((categ) => (
                  <option key={categ.id} value={categ.id}>
                    {categ.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Product Highlight Information
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Highlight Information"
                value={highlightInformation}
                onChange={(e) => setHighlightInformation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Code</label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Shipping Cost
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Shipping Cost"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Minimum Order
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Minimum Order"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Product Measurement
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Product Measurement"
                value={productMeasurement}
                onChange={(e) => setProductMeasurement(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Product Unit
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Product Unit"
                value={productUnit}
                onChange={(e) => setProductUnit(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Product Color
              </label>
              {colors.map((color) => (
                <input
                  key={color.id}
                  className="w-full border border-gray-300 p-2 rounded mb-2"
                  type="color"
                  value={color.value}
                  onChange={(e) => handleColorChange(color.id, e.target.value)}
                />
              ))}
              <button
                onClick={() =>
                  setColors([...colors, { id: colors.length + 1 }])
                }
                type="button"
                className="mt-2 text-blue-500"
              >
                + Add More Color
              </button>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Search Tag/Keyword
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                placeholder="Please Search Tag"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Featured Images
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="file"
                onChange={handleFeaturedImageChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3">
                <label className="block text-gray-700 font-bold mb-2">
                  Product Description
                </label>
                <textarea
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Please Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Is Featured?
                </label>
                <input
                  type="checkbox"
                  className="mr-2 leading-tight"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Is Available?
                </label>
                <input
                  type="checkbox"
                  className="mr-2 leading-tight"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Status (Is Publish?)
                </label>
                <input
                  type="checkbox"
                  className="mr-2 leading-tight"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
              </div>
            </div>
            <div className="col-span-2">
              <h2 className="text-gray-700 font-bold mb-4 mt-4">
                Product Specification
              </h2>
              <div className="grid">
                <div>
                  <label className="block text-gray-700 mb-2">Title : 1</label>
                  <input
                    className="w-1/2 border border-gray-300 p-2 rounded"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Description : 1
                  </label>
                  <input
                    className="w-1/2 border border-gray-300 p-2 rounded"
                    type="text"
                  />
                </div>
              </div>
              <button className="mt-2 text-black">
                <strong>+</strong> Add More Specification
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              type="submit"
            >
              {productId ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShowProductList;
