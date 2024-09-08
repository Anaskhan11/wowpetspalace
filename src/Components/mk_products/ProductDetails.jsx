import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./productDetails.css";

import { createCartItem } from "./utils";

import { IoCartOutline } from "react-icons/io5";
import secureLocalStorage from "react-secure-storage";

const ProductDetail = () => {
  console.log("ProductDetail component rendered");
  const { slug } = useParams();

  console.log(slug, "slug");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/product/productbyslug/${slug}`
        );

        console.log("Product data by id:", response);
        setProduct(response.data.result);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const loadCartFromLocalStorage = () => {
      const storedCart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      const storedTotalPrice =
        JSON.parse(secureLocalStorage.getItem("totalPrice")) || 0;

      setCart(storedCart);
      setTotalPrice(storedTotalPrice);
    };

    fetchProduct();
    loadCartFromLocalStorage();
  }, [slug]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.totalPrice =
        existingProduct.quantity * product.original_price;
    } else {
      const newCartItem = createCartItem(product, quantity);
      cart.push(newCartItem);
    }

    const updatedTotalPrice = cart.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    setCart(cart);
    setTotalPrice(updatedTotalPrice);

    secureLocalStorage.setItem("cart", JSON.stringify(cart));
    secureLocalStorage.setItem("totalPrice", JSON.stringify(updatedTotalPrice));

    window.location.reload();
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <>
        {Array.from({ length: totalStars }, (_, i) => {
          const starNumber = i + 1;
          return (
            <span
              key={starNumber}
              style={{
                fontSize: "20px",
                color: starNumber <= rating ? "#ffc107" : "#d3d3d3",
              }}
            >
              &#9733;
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full flex items-center justify-center md:w-1/2 rounded-md">
          <img
            src={`${import.meta.env.VITE_APP_BASE_URL}/${product.images[0]}`}
            alt={product.name}
            className="w-[462px] h-[462px] object-cover rounded-md"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-[#39b54a] text-xs text-white inline-block font-semibold px-3 py-1 rounded mb-2">
            In Stock
          </div>
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>

          <div className="text-xl font-bold text-orange-500 mb-2">
            ${product.original_price}
          </div>
          <div className="flex items-center mb-2">
            {renderStars(product.rating || 0)}
            <span className="text-gray-700 ml-2">
              ({product.reviews} Reviews)
            </span>
          </div>
          <p className="text-gray-700 font-medium mb-2">
            {product.description}
          </p>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Size:</h3>
            <div className="flex gap-2">
              {["1 kg", "250 gram", "500 gram", "750 gram"].map((size) => (
                <button
                  key={size}
                  className="border border-gray-300 p-2 rounded-full text-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
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
                <p>Add To Cart</p>
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

          <span>Categories: {product.categoryTitle}</span>
          <div>
            <span>Tags : {product.subCategory}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
