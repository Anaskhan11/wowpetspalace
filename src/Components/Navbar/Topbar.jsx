import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// Icons & Logos
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart, FaUserAstronaut } from "react-icons/fa";
import logo from "../../../public/logo-1-black.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import secureLocalStorage from "react-secure-storage";
import { FaRegCircleUser, FaRegUser } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const Topbar = () => {
  const navigate = useNavigate();
  const [isCartOpen, setCartOpen] = useState(false);
  const [totalprice, setTotalPrice] = useState(0);
  const [countproduct, setCountProduct] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // get the token from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/authUser/signin`,
        {
          email,
          password,
        }
      );
      console.log("Login", res.data.message);
      if (res.data.message === "Login successful") {
        localStorage.setItem("token", res.data.data.authToken);
        console.log("Login", res.data);
        window.location.reload();
        navigate("/");
        toast.success("Login Successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.warning("Email or passowrd is Incorrect", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.warning("Email or passowrd is Incorrect", {
        position: "top-center",
      });
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleCreateAccountClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    window.location.reload();
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getCartFromLocal = () => {
      const cart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      setCartItems(cart);
      const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalPrice(totalPrice);
      setCountProduct(cart.length);
    };

    getCartFromLocal();
  }, []);

  useEffect(() => {
    const getCartFromLocal = () => {
      const cart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      console.log(cart, "___________+++++++++++++++)____0---0--");
      setCartItems(cart);
    };

    getCartFromLocal();
  }, [isCartOpen]);

  const handleCartClick = () => {
    setCartOpen(!isCartOpen);
  };

  const handleCloseCart = () => {
    setCartOpen(false);
  };

  const removeProductFromLocalStorage = (productId) => {
    const products = JSON.parse(secureLocalStorage.getItem("cart")) || [];
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    const removedProduct = products.find((product) => product.id === productId);

    if (removedProduct) {
      const updatedTotalPrice =
        JSON.parse(secureLocalStorage.getItem("totalPrice")) -
        removedProduct.totalPrice;
      secureLocalStorage.setItem("cart", JSON.stringify(updatedProducts));
      secureLocalStorage.setItem(
        "totalPrice",
        JSON.stringify(updatedTotalPrice)
      );
      window.location.reload();
      setCartOpen(true);
    }
  };

  const handleRemove = (productId) => {
    removeProductFromLocalStorage(productId);
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);
    const updatedTotalprice = totalprice.filter(
      (item) => item.id !== productId
    );

    setCartItems(updatedCartItems);
    setTotalPrice(updatedTotalprice);
  };

  return (
    <>
      <div className="relative w-full">
        <div className="flex items-center justify-between w-full">
          {/* First Section */}
          <div className="flex gap-4 items-center">
            <div className="p-2 rounded-md bg-slate-50 border border-slate-300 flex items-center justify-center">
              <GiHamburgerMenu className="h-6 w-6 flex items-center justify-center hover:cursor-pointer" />
            </div>
            <Link to="/">
              <img src={logo} alt="company logo" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Second Section */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-lg font-semibold text-slate-800 hover:text-slate-900"
            >
              Home
            </Link>
            <Link
              to="/allarticles"
              className="text-lg font-semibold text-slate-800 hover:text-slate-900"
            >
              Articles
            </Link>
            <Link
              to="/allbreeds"
              className="text-lg font-semibold text-slate-800 hover:text-slate-900 ml-4"
            >
              Breeds
            </Link>
            <Link
              to="/contact-us"
              className="text-lg font-semibold text-slate-800 hover:text-slate-900 ml-4"
            >
              Contact Us
            </Link>
          </div>

          {/* Third Section */}

          <div className="flex items-center gap-4">
            <div className="relative">
              {!isLoggedIn && (
                <FaRegUser
                  className="h-6 w-6 text-slate-800 hover:text-orange-500 group cursor-pointer"
                  onClick={handleToggleDropdown}
                />
              )}
              {/* {isLoggedIn && (
                <FaRegCircleUser className="h-6 w-6 text-slate-800 hover:text-orange-500 group cursor-pointer" />
              )} */}

              {isLoggedIn && (
                <FaRegCircleUser
                  className="h-6 w-6 text-slate-800 hover:text-orange-500 group cursor-pointer"
                  onClick={handleToggleDropdown}
                />
              )}

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-80 p-4 bg-white shadow-lg border rounded-lg z-10"
                >
                  {!isLoggedIn ? (
                    <div>
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold">Sign in</span>
                        <Link
                          to="/signup"
                          className="text-orange-500"
                          onClick={() => setIsOpen(false)}
                        >
                          Create an Account
                        </Link>
                      </div>
                      <form onSubmit={handleLogin}>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                          >
                            Username or email
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                          >
                            Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                          />
                        </div>
                        <div>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg w-72 focus:outline-none focus:shadow-outline">
                            LOGIN
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={handleLogout}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline"
                      >
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <FaRegHeart className="h-6 w-6 text-slate-800 hover:text-orange-600 group" />
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-orange-600 rounded-full">
                0
              </span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-orange-600 group"
              onClick={handleCartClick}
            >
              <div className="relative flex items-center">
                <AiOutlineShoppingCart className="h-6 w-6 text-slate-800 group-hover:text-orange-600" />
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-orange-600 rounded-full">
                  {countproduct}
                </span>
              </div>
              <span className="inline-flex items-center justify-center text-base font-bold leading-none text-gray-800 group-hover:text-orange-600">
                $ {totalprice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Shopping cart
                  </h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handleCloseCart}
                    >
                      <span className="sr-only">Close panel</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={
                                item.images && item.images.length > 0
                                  ? `${import.meta.env.VITE_APP_BASE_URL}/${
                                      item.images[0]
                                    }`
                                  : `${import.meta.env.VITE_APP_BASE_URL}/${
                                      item.featured_image
                                    }`
                              }
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          {/* <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={
                                item === "images"
                                  ? `${import.meta.env.VITE_APP_BASE_URL}/${
                                      item.featured_image
                                    }`
                                  : `${import.meta.env.VITE_APP_BASE_URL}/${
                                      item.images[0]
                                    }`
                              }
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div> */}
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href="#">{item.name}</a>
                                </h3>
                                <p className="ml-4">${item.totalPrice}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => handleRemove(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p className="text-orange-500 font-bold">${totalprice}</p>
                </div>
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    onClick={() => setCartOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={handleCloseCart}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
