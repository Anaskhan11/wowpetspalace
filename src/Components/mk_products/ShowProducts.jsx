import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaSearchPlus } from "react-icons/fa";
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import "./product.css";
import { createCartItem } from "./utils";
import secureLocalStorage from "react-secure-storage";
import ProductModal from "./ProductModal";

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [activeTab, setActiveTab] = useState("All Items");
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [featureProduct, setFeaturedProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "Featured") {
      const getFeaturedProducts = async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/product/getallFeaturedProduct`
        );
        console.log(res.data.result, "check for featured products");
        if (res.status === 200) {
          setFeaturedProduct(res.data.result);
        }
      };
      getFeaturedProducts();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/product/getallproducts`
      );

      console.log("response Show Product", response);
      setProducts(response.data.result);
    };

    const loadCartFromLocalStorage = () => {
      const storedCart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      const storedTotalPrice =
        JSON.parse(secureLocalStorage.getItem("totalPrice")) || 0;
      setCart(storedCart);
      setTotalPrice(storedTotalPrice);
    };

    fetchProducts();
    loadCartFromLocalStorage();
  }, []);

  const handleStarClick = (productId, rating) => {
    setSelectedRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };

  const renderStars = (rating, productId) => {
    const totalStars = 5;
    const selectedRating = selectedRatings[productId] || rating;

    return (
      <>
        {Array.from({ length: totalStars }, (_, i) => {
          const starNumber = i + 1;
          return (
            <span
              key={starNumber}
              onClick={() => handleStarClick(productId, starNumber)}
              style={{
                fontSize: "20px",
                color: starNumber <= selectedRating ? "yellow" : "gray",
                cursor: "pointer",
              }}
            >
              &#9733;
            </span>
          );
        })}
      </>
    );
  };

  const renderReviews = (reviews) => {
    const reviewsText = reviews === 0 ? "0 reviews" : `${reviews} reviews`;
    return (
      <span
        style={{
          fontSize: "14px",
          marginLeft: "8px",
        }}
      >
        ({reviewsText})
      </span>
    );
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const filterProducts = (products) => {
    switch (activeTab) {
      case "Sales":
        return products.filter((product) => product.onSale);
      case "Featured":
        return featureProduct;
      case "Best Seller":
        return products.filter((product) => product.bestSeller);
      default:
        return products;
    }
  };

  const filteredProducts = filterProducts(products);

  const handleCardClick = (productId) => {
    navigate(`/productdetail/${productId}`);
  };

  const addToCart = (product) => {
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

  const handleSearchPlusClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex w-full justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Trending This Week</h2>
        <div>
          {["All Items", "Sales", "Featured", "Best Seller"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full mr-2 ${
                activeTab === tab
                  ? "bg-purple-800 text-white"
                  : "bg-transparent hover:bg-gray-200"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="product-container relative overflow-hidden p-4 flex flex-col cursor-pointer shadow-lg transition duration-300 ease-in-out hover:border-dotted hover:border-orange-500"
          >
            {product.onSale && (
              <div className="discount-label absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                -{product.discount}%
              </div>
            )}
            <div className="h-32 rounded-t-lg mb-4 relative">
              <img
                src={`${import.meta.env.VITE_APP_BASE_URL}/${
                  product.images[0]
                }`}
                alt="product"
                className="w-full h-full object-cover"
                onClick={() => handleCardClick(product.slug)}
              />
              <div className="hover-menu absolute top-1/2 right-[-60px] transform -translate-y-1/2 flex flex-col opacity-0 transition-opacity duration-300 ease-in-out">
                <button className="bg-white p-2 rounded-full mb-2 hover:bg-orange-500 hover:text-white">
                  <FaRegHeart />
                </button>
                <button className="bg-white p-2 rounded-full mb-2 hover:bg-orange-500 hover:text-white">
                  <TbArrowsDoubleNeSw />
                </button>
                <button
                  className="bg-white p-2 rounded-full hover:bg-orange-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchPlusClick(product);
                  }}
                >
                  <FaSearchPlus />
                </button>
              </div>
              <button
                className="add-to-cart-button hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-700 hover:bg-orange-500 text-white px-8 py-6 rounded-full text-sm font-bold transition-opacity duration-300 ease-in-out mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Add To Cart"}
              </button>
            </div>
            <div className="product-pricing flex items-center gap-2">
              <h5 className="text-md font-bold text-purple-800">
                ${product.original_price}
              </h5>
              {/* <span className="original-price line-through text-gray-500 text-sm">${product.original_price}</span> */}
            </div>
            <h3 className="text-md font-semibold mb-2">{product.name}</h3>
            <div className="flex items-center mt-2">
              <span>{renderStars(product.rating || 0, product.id)}</span>
              {renderReviews(product.reviews || 0)}
            </div>
          </div>
        ))}

        {/* {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="product-container relative overflow-hidden p-4 flex flex-col cursor-pointer shadow-lg transition duration-300 ease-in-out hover:border-dotted hover:border-orange-500"
          >
            {product.onSale && (
              <div className="discount-label absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                -{product.discount}%
              </div>
            )}
            <div className="h-32 rounded-t-lg mb-4 relative">
              <img
                src={`${import.meta.env.VITE_APP_BASE_URL}/${
                  product.images[0]
                }`}
                alt="product"
                className="w-full h-full object-cover"
                onClick={() => handleCardClick(product.slug)}
              />
              <div className="hover-menu absolute top-1/2 right-[-60px] transform -translate-y-1/2 flex flex-col opacity-0 transition-opacity duration-300 ease-in-out">
                <button className="bg-white p-2 rounded-full mb-2 hover:bg-orange-500 hover:text-white">
                  <FaRegHeart />
                </button>
                <button className="bg-white p-2 rounded-full mb-2 hover:bg-orange-500 hover:text-white">
                  <TbArrowsDoubleNeSw />
                </button>
                <button
                  className="bg-white p-2 rounded-full hover:bg-orange-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchPlusClick(product);
                  }}
                >
                  <FaSearchPlus />
                </button>
              </div>
              <button
                className="add-to-cart-button hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-700 hover:bg-orange-500 text-white px-6 py-2 rounded-full text-xs font-bold transition-opacity duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Add To Cart"}
              </button>
            </div>
            <div className="product-pricing flex items-center gap-2">
              <h5 className="text-md font-bold text-purple-800">
                ${product.original_price}
              </h5>
            </div>
            <h3 className="text-md font-semibold mb-2">{product.name}</h3>
            <div className="flex items-center mt-2">
              <span>{renderStars(product.rating || 0, product.id)}</span>
              {renderReviews(product.reviews || 0)}
            </div>
          </div>
        ))} */}
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ShowProducts;
