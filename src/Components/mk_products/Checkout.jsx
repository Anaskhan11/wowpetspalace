import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";
import { loadStripe } from "@stripe/stripe-js";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { FaCcAmex } from "react-icons/fa";
import { FaCcDiscover } from "react-icons/fa";
import { BiSolidCreditCardFront } from "react-icons/bi";
import { BsCreditCard2BackFill } from "react-icons/bs";

// Load Stripe
// const stripePromise = loadStripe(
//   "pk_test_51Jn8daH8TsHWSDoWaGhAd8cyd6cDaJ6pcXcrYdmaI7fJV0qJpXOC4lu7X5RHpZaEYJFqk5uhoBJKIq6MuomzQJ9U00WkIQq3Az"
// );
const stripePromise = loadStripe(
  "pk_test_51PpuAJGaz8KfBafwuNYGqnMEgzQf4l9VX4jRMuDnrjElVLBVSueCLdm8KZMgMhMZDXHtyyOXtb8IjPBje9thIScO00m0ujsCRi"
);

const CheckoutForm = ({
  handlePaymentSubmit,
  termsAccepted,
  totalAmount,

  onCaptchaChange,
  onTermsAcceptedChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: {
        name: event.target.cardholderName.value,
      },
    });

    if (error) {
      console.log("[error]", error);
      toast.error(error.message);
    } else {
      handlePaymentSubmit(paymentMethod, stripe);
    }
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="border border-green-500 border-dashed  p-2">
        <div className="flex justify-between items-center mb-4 gap-2">
          <div className="flex items-center p-4 border border-blue-500 rounded-lg w-full max-w-xs shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Blue empty circle (radio button style) */}
            <div className="w-4 h-4 mr-4 border-2 border-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>{" "}
              {/* Optional inner circle */}
            </div>

            {/* Credit card icon and text */}
            <div className="flex flex-col items-start">
              <svg
                className="w-4 h-4 mb-1 "
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <span className="text-sm font-semibold ">Credit Card</span>
            </div>
          </div>

          <div className="flex items-center p-4 border  rounded-lg w-full max-w-xs shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Blue empty circle (radio button style) */}
            <div className="w-4 h-4 mr-4 border-2 border-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>{" "}
              {/* Optional inner circle */}
            </div>

            {/* Icon and text */}
            <div className="flex flex-col items-start">
              <svg
                className="w-4 h-4 mb-1 "
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <span className="text-sm font-semibold ">ACH bank debit</span>
            </div>
          </div>
        </div>
        {/* Cardholder Name */}
        <div className="mb-4 ">
          <label className="block mb-2 text-lg font-medium">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardholderName"
            placeholder="Card Holder Name"
            className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Card Number Section */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Card Number</label>
          <div className="flex items-center border border-gray-300 rounded-md p-3">
            <CardNumberElement options={elementStyle} className="flex-1" />
            {/* Card Icons */}
            <div className="flex ml-3">
              <FaCcVisa className="h-6 ml-2 text-blue-600" />
              <FaCcMastercard className="h-6 ml-2" />
              <FaCcAmex className="h-6 ml-2 text-blue-600" />
              <FaCcDiscover className="h-6 ml-2 bg-white text-black-600" />
            </div>
          </div>
        </div>

        {/* Expiration Date & CVV */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-lg font-medium">
              Expiration Date
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardExpiryElement options={elementStyle} />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium">
              Security Code (CVV)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3">
              <CardCvcElement options={elementStyle} className="flex-1" />
              <div className="flex ml-3">
                <BiSolidCreditCardFront className="h-4 ml-2 bg-white text-black-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ReCAPTCHA */}
      <div className="mt-4">
        <ReCAPTCHA
          sitekey="AIzaSyDb4CcczV2yCEsw3YAVYhD-CMhlL2poquY"
          onChange={onCaptchaChange}
        />
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => onTermsAcceptedChange(e.target.checked)}
        />
        <label htmlFor="terms" className="ml-2">
          <Link to="/terms-and-conditions" target="_blank">
            I accept the terms and conditions
          </Link>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full mt-4 py-3 rounded-full font-bold cursor-pointer transition duration-300
        ${
          termsAccepted
            ? "bg-orange-500 hover:bg-blue-800 text-white"
            : "bg-gray-500 text-gray-300 cursor-not-allowed"
        }`}
        disabled={!termsAccepted}
      >
        Pay ${totalAmount} and Place Order
      </button>
    </form>
  );
};
const Checkout = () => {
  const navigate = useNavigate();

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [product, setProduct] = useState([]);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };
  // const handleBillingInputChange = (e) => {
  //   setBillingDetails({
  //     ...billingDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleShippingInputChange = (e) => {
  //   setShippingDetails({
  //     ...shippingDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleAddressCheckboxChange = () => {
  //   setUseSameAddress(!useSameAddress);
  // };
  const handleAddressCheckboxChange = (event) => {
    setUseSameAddress(event.target.checked);
    if (event.target.checked) {
      setShippingDetails(billingDetails);
    }
  };

  const handleBillingInputChange = (event) => {
    const { name, value } = event.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
    if (useSameAddress) {
      setShippingDetails((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleShippingInputChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchProduct = () => {
      const cart = JSON.parse(secureLocalStorage.getItem("cart")) || [];
      setProduct(cart);
    };
    fetchProduct();
  }, []);

  const handlePaymentSubmit = async (paymentMethod, stripe) => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    if (!billingDetails || !shippingDetails) {
      toast.error("Check the form Something is missing");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please Sign in or Register first");
      return;
    }

    const user = jwtDecode(token);
    const productDetails = JSON.parse(secureLocalStorage.getItem("cart"));

    const totalAmount = product.reduce(
      (acc, pro) => acc + pro.totalPrice + pro.shipping_cost,
      0
    );

    const orderDatas = {
      user_id: user.id,
      billingDetails,
      shippingDetails,
      id: productDetails[0].id,
      shop_id: productDetails[0].shopId,
      name: productDetails[0].name,
      quantity: productDetails[0].quantity,
      totalPrice: totalAmount,
      price: productDetails[0].price,
      shipping_cost: productDetails[0].shipping_cost,
      product_unit: productDetails[0].product_unit,
    };

    try {
      // First, create the order
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/product/createOrder`,
        orderDatas
      );

      console.log("Order creation response:", orderResponse);

      if (orderResponse.status !== 200) {
        toast.error(`Order creation failed. Status: ${orderResponse.status}`);
        return;
      }

      const order_id = orderResponse.data.insertId;

      // Now create the PaymentIntent
      const paymentIntentResponse = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/payment/create-payment-intent`,
        {
          paymentMethodType: "card",
          currency: "usd",
          amount: parseFloat(totalAmount * 100),
          totalAmount: totalAmount,
          user_id: user.id,
          order_id: order_id,
        }
      );

      console.log("PaymentIntent Response:", paymentIntentResponse);

      const { clientSecret } = paymentIntentResponse.data;

      if (!clientSecret) {
        console.error("Client secret is missing from the response");
        toast.error("Unable to process payment. Please try again.");
        return;
      }

      // Confirm the PaymentIntent
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (error) {
        console.error("Error confirming card payment:", error);
        toast.error(
          error.message || "Payment confirmation failed. Please try again."
        );
        return;
      }

      if (paymentIntent.status === "succeeded") {
        secureLocalStorage.removeItem("cart");
        secureLocalStorage.removeItem("totalPrice");
        toast.success("Payment successful and order placed!");
        navigate("/");
        window.location.reload();
      } else {
        console.error("PaymentIntent status:", paymentIntent.status);
        toast.error(`Payment failed. Status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error("Error processing payment and order:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          `Error: ${error.response.data.error || "Unknown error occurred"}`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("No response received from the server. Please try again.");
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message || "Unknown error occurred"}`);
      }
    }
  };

  // const handlePaymentSubmit = async (paymentMethod, stripe) => {
  //   if (!termsAccepted) {
  //     toast.error("Please accept the terms and conditions.");
  //     return;
  //   }

  //   if (!billingDetails || !shippingDetails) {
  //     toast.error("Check the form Something is missing");
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast.warning("Please Sign in or Register first");
  //     return;
  //   }

  //   const user = jwtDecode(token);
  //   const productDetails = JSON.parse(secureLocalStorage.getItem("cart"));

  //   const totalAmount = product.reduce(
  //     (acc, pro) => acc + pro.totalPrice + pro.shipping_cost,
  //     0
  //   );

  //   const orderDatas = {
  //     user_id: user.id,
  //     billingDetails,
  //     shippingDetails,
  //     id: productDetails[0].id,
  //     shop_id: productDetails[0].shopId,
  //     name: productDetails[0].name,
  //     quantity: productDetails[0].quantity,
  //     totalPrice: totalAmount,
  //     price: productDetails[0].price,
  //     shipping_cost: productDetails[0].shipping_cost,
  //     product_unit: productDetails[0].product_unit,
  //   };

  //   try {
  //     // Create PaymentIntent
  //     const paymentIntentResponse = await axios.post(
  //       `${import.meta.env.VITE_APP_BASE_URL}/payment/create-payment-intent`,
  //       {
  //         paymentMethodType: "card",
  //         currency: "usd",
  //         amount: Math.round(totalAmount * 100), // Convert to cents
  //         user_id: user.id,
  //         order_id: res.data.insertId,
  //       }
  //     );

  //     console.log("PaymentIntent Response:", paymentIntentResponse);

  //     const { clientSecret } = paymentIntentResponse.data;

  //     if (!clientSecret) {
  //       console.error("Client secret is missing from the response");
  //       toast.error("Unable to process payment. Please try again.");
  //       return;
  //     }

  //     // Confirm the PaymentIntent
  //     const { error, paymentIntent } = await stripe.confirmCardPayment(
  //       clientSecret,
  //       {
  //         payment_method: paymentMethod.id,
  //       }
  //     );

  //     if (error) {
  //       console.error("Error confirming card payment:", error);
  //       toast.error(
  //         error.message || "Payment confirmation failed. Please try again."
  //       );
  //       return;
  //     }

  //     if (paymentIntent.status === "succeeded") {
  //       const res = await axios.post(
  //         `${import.meta.env.VITE_APP_BASE_URL}/product/createOrder`,
  //         orderDatas
  //       );

  //       console.log("Order creation response:", res);

  //       if (res.status === 200) {
  //         secureLocalStorage.removeItem("cart");
  //         secureLocalStorage.removeItem("totalPrice");
  //         toast.success("Payment successful and order placed!");
  //         navigate("/");
  //         window.location.reload();
  //       } else {
  //         toast.error(`Order creation failed. Status: ${res.status}`);
  //       }
  //     } else {
  //       console.error("PaymentIntent status:", paymentIntent.status);
  //       toast.error(`Payment failed. Status: ${paymentIntent.status}`);
  //     }
  //   } catch (error) {
  //     console.error("Error processing payment and order:", error);
  //     if (error.response) {
  //       console.error("Error response:", error.response.data);
  //       toast.error(
  //         `Error: ${error.response.data.error || "Unknown error occurred"}`
  //       );
  //     } else if (error.request) {
  //       console.error("Error request:", error.request);
  //       toast.error("No response received from the server. Please try again.");
  //     } else {
  //       console.error("Error message:", error.message);
  //       toast.error(`Error: ${error.message || "Unknown error occurred"}`);
  //     }
  //   }
  // };

  const totalAmount = product.reduce(
    (acc, pro) => acc + pro.totalPrice + pro.shipping_cost,
    0
  );

  useEffect(() => {
    const getAppUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Please Sign in or Register first");
        return;
      }

      const user = jwtDecode(token);
      const { id } = user;

      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/authUser/appusersbyid/${id}`
      );

      console.log(res.data[0], "APP USER RESPONSE =-=-==-=-");

      if (res.data[0]) {
        setBillingDetails({
          firstName: res.data[0].billing_first_name || "",
          lastName: res.data[0].billing_last_name || "",
          company: res.data[0].billing_company || "",
          country: res.data[0].billing_country || "",
          address1: res.data[0].billing_address_1 || "",
          address2: res.data[0].billing_address_2 || "",
          city: res.data[0].billing_city || "",
          state: res.data[0].billing_state || "",
          zipCode: res.data[0].billing_postal_code || "",
          phone: res.data[0].billing_phone || "",
          email: res.data[0].email || "",
        });
      }
    };

    getAppUser();
  }, []);

  return (
    <div className="container mx-auto p-4 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg ">
          <h2 className="text-2xl font-bold mb-4">Billing details</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={billingDetails.firstName}
                  onChange={handleBillingInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  name="lastName"
                  value={billingDetails.lastName}
                  onChange={handleBillingInputChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Company name (optional)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="company"
                value={billingDetails.company}
                onChange={handleBillingInputChange}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={billingDetails.country}
                onChange={handleBillingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                Street address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="House number and street name"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                name="address1"
                value={billingDetails.address1}
                onChange={handleBillingInputChange}
              />
              <input
                type="text"
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full p-2 border border-gray-300 rounded"
                name="address2"
                value={billingDetails.address2}
                onChange={handleBillingInputChange}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={billingDetails.city}
                onChange={handleBillingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={billingDetails.state}
                onChange={handleBillingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={billingDetails.zipCode}
                onChange={handleBillingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="phone"
                value={billingDetails.phone}
                onChange={handleBillingInputChange}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded bg-gray-200"
                name="email"
                disabled
                value={billingDetails.email}
                onChange={handleBillingInputChange}
              />
            </div>

            {/* ================================================== */}
            <div className="bg-white p-2 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-4">Shipping address</h2>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={useSameAddress}
                  onChange={handleAddressCheckboxChange}
                />
                Use the same address for shipping
              </label>

              {!useSameAddress && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingDetails.firstName}
                        onChange={handleShippingInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingDetails.lastName}
                        onChange={handleShippingInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-2">
                        Company name (optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={billingDetails.company}
                        onChange={handleShippingInputChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        Country / Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="House number and street name"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        value={billingDetails.country}
                        onChange={handleBillingInputChange}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="House number and street name"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={billingDetails.address1}
                      onChange={handleBillingInputChange}
                    />
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={billingDetails.address2}
                      onChange={handleBillingInputChange}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-2">
                        Town / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={billingDetails.city}
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={billingDetails.state}
                        onChange={handleBillingInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={billingDetails.zipCode}
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={billingDetails.phone}
                        onChange={handleBillingInputChange}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block mb-2">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-200"
                      disabled
                      value={billingDetails.email}
                      onChange={handleBillingInputChange}
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <div className="border-4 rounded-md border-gray-200 p-4">
            <h2 className="text-2xl font-bold mb-4">Your order</h2>
            <hr />
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl my-4">Product</span>
              <span className="font-bold text-xl my-4">Price</span>
            </div>
            <>
              {product.map((pro) => (
                <div key={pro.id} className="pb-2">
                  <hr />
                  <div className="flex justify-between my-4">
                    <span>
                      {pro.name} x {pro.quantity}
                    </span>
                    <span>${pro.price * pro.quantity}</span>
                  </div>
                </div>
              ))}
              <hr />
              <div className="flex justify-between mb-8 mt-6">
                <span className="font-bold">Subtotal</span>
                <span>
                  ${product.reduce((acc, pro) => acc + pro.totalPrice, 0)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between mb-8 mt-6">
                <span className="font-bold">Shipping </span>
                <span>
                  ${product.reduce((acc, pro) => pro.shipping_cost, 0)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold mb-8 mt-6">
                <span className="font-bold">Total</span>
                <span className="text-orange-500">
                  $
                  {product.reduce(
                    (acc, pro) => acc + pro.totalPrice + pro.shipping_cost,
                    0
                  )}
                </span>
              </div>
              <hr />
            </>
            <hr />
            <div className="mt-4 text-lg font-bold">
              <h2>Payment Method</h2>
            </div>
            <div className="p-2">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  handlePaymentSubmit={handlePaymentSubmit}
                  termsAccepted={termsAccepted}
                  totalAmount={totalAmount}
                  onTermsAcceptedChange={setTermsAccepted}
                  onCaptchaChange={onCaptchaChange}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
