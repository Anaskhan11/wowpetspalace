import React, { useState, useEffect } from "react";
import { FaTimes, FaRegHeart } from "react-icons/fa";

import { createCartItem } from "../mk_products/utils";
import { IoCartOutline } from "react-icons/io5";
import secureLocalStorage from "react-secure-storage";
const ProductCardModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;

  useEffect(() => {
    const loadCartFromLocalStorage = () => {
      const storedCart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      const storedTotalPrice =
        JSON.parse(secureLocalStorage.getItem("totalPrice")) || 0;

      setCart(storedCart);
      setTotalPrice(storedTotalPrice);
    };
    loadCartFromLocalStorage();
  }, []);
  const handleAddToCart = (product) => {
    setIsLoading(true);

    setTimeout(() => {
      const cart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      const existingProduct = cart.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice =
          existingProduct.quantity * product.original_price;
      } else {
        const newCartItem = createCartItem(product);
        cart.push(newCartItem);
      }

      const updatedTotalPrice = cart.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      setCart(cart);
      setTotalPrice(updatedTotalPrice);

      secureLocalStorage.setItem("cart", JSON.stringify(cart));
      secureLocalStorage.setItem(
        "totalPrice",
        JSON.stringify(updatedTotalPrice)
      );

      setIsLoading(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={`${import.meta.env.VITE_APP_BASE_URL}/${
              product.featured_image
            }`}
            alt={product.name}
            className="w-full h-96 object-cover rounded mb-4 md:mb-0"
          />
        </div>
        <div className="md:w-1/2 md:pl-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <button onClick={onClose}>
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-lg">&#9733;</span>
              <span className="text-yellow-500 text-lg">&#9733;</span>
              <span className="text-yellow-500 text-lg">&#9733;</span>
              <span className="text-yellow-500 text-lg">&#9733;</span>
              <span className="text-gray-300 text-lg">&#9733;</span>
            </div>
            <span className="ml-2 text-gray-500">(5 Reviews)</span>
          </div>
          <div className="mb-4">
            <span className="text-xl font-bold text-orange-500">
              ${product.original_price}
            </span>
          </div>
          <p className="mb-4">{product.description}</p>
          <div className="border-2 rounded-md">
            <div className="flex items-center gap-4 p-3">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-orange-500 hover:text-white focus:outline-none"
                >
                  -
                </button>
                <div className="w-14 flex items-center justify-center">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full ring-0 focus:ring-0 outline-none text-center no-spinner focus:outline-none border-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-orange-500 hover:text-white focus:outline-none"
                >
                  +
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="bg-purple-600 flex items-center gap-2 text-white px-6 py-2 rounded-full"
              >
                <IoCartOutline className="text-white h-5 w-5" />
                {isLoading ? "Loading..." : "Add To Cart"}
              </button>
            </div>
            <hr />
            <div className="flex gap-4 text-gray-600 p-3">
              <button className="flex items-center hover:text-orange-500 transition-color">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-2">Add to compare</span>
              </button>
              <button className="flex items-center hover:text-orange-500 transition-color">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-2">Add to wishlist</span>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Categories:</span>{" "}
            {product.categoryTitle}
          </div>
          <div>
            <span className="font-semibold">Tags:</span> {product.search_tag}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardModal;
