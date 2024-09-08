import React, { useState, useEffect } from "react";
import axios from "axios";
import { createCartItem } from "../mk_products/utils";
import { FaRegHeart, FaSearchPlus } from "react-icons/fa";
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import secureLocalStorage from "react-secure-storage";
import ProductCardModal from "./ProductCardModal";

const ProductCard = () => {
  const [featureProduct, setFeaturedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const getFeaturedProduct = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/product/getallFeaturedProduct`
      );
      console.log(res.data.result, "check for featured product");
      if (res.status === 200) {
        setFeaturedProduct(res.data.result);
      }
    };
    getFeaturedProduct();
    loadCartFromLocalStorage();
  }, []);

  const handleSearchPlusClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  const loadCartFromLocalStorage = () => {
    const storedCart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
    const storedTotalPrice =
      JSON.parse(secureLocalStorage.getItem("totalPrice")) || 0;

    setCart(storedCart);
    setTotalPrice(storedTotalPrice);
  };

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

  if (!featureProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-7">
      <h1 className="mt-12 font-bold text-2xl">Featured Products</h1>
      <div className="flex space-x-4 mt-4 overflow-x-scroll">
        {featureProduct.map((product) => (
          <div
            key={product.id}
            className="relative group p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out"
            style={{
              minWidth: "250px",
              minHeight: "300px",
              backgroundImage: `url(${import.meta.env.VITE_APP_BASE_URL}/${
                product.featured_image
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              color: "white",
            }}
          >
            <div>
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-xl font-bold mt-4">{product.original_price}</p>
            </div>

            <div className="hover-menu absolute top-1/2 right-[10px] transform -translate-y-1/2 flex flex-col opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              <button className="bg-white  text-black p-2 h-12 w-12 flex items-center justify-center rounded-full mb-2 hover:bg-orange-500 hover:text-black">
                <FaRegHeart />
              </button>
              <button className="bg-white text-black p-2 rounded-full mb-2 h-12 w-12 flex items-center justify-center  hover:bg-orange-500 hover:text-black">
                <TbArrowsDoubleNeSw />
              </button>
              <button
                className="bg-white text-black p-2 rounded-full h-12 w-12 flex items-center justify-center  hover:bg-orange-500 hover:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearchPlusClick(product);
                }}
              >
                <FaSearchPlus />
              </button>
            </div>
            <button
              className="add-to-cart-button hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-700 hover:bg-orange-500 text-white px-6 py-4 w-52 rounded-full text-xs font-bold transition-opacity duration-300 ease-in-out group-hover:block"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Add To Cart"}
            </button>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductCardModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ProductCard;
