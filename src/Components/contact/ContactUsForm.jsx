import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { FaPhoneAlt } from "react-icons/fa";
import { TbMailbox } from "react-icons/tb";
import { GiHospitalCross } from "react-icons/gi";

const ContactUsForm = () => {
  const [contactReasons, setContactReasons] = useState([]);
  const [contactReason, setContactReason] = useState("");
  const [contactCategories, setContactCategories] = useState([]);
  const [contactCategory, setContactCategory] = useState("");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailRequestFeedback, setEmailRequestFeedback] = useState(0);
  const [callRequestFeedback, setCallRequestFeedback] = useState(0);
  const [receiveEmailMarketing, setReceiveEmailMarketing] = useState(0);
  const [status, setStatus] = useState("active");

  useEffect(() => {
    // Fetch contact reasons
    const getContactReasons = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/getContactUsReason/`
      );
      setContactReasons(response.data.result);
    };
    // Fetch contact categories
    const getContactCategories = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/getContactUsCategory/`
      );
      setContactCategories(response.data.result);
    };

    getContactReasons();
    getContactCategories();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/contact/contactUs`,
      {
        contact_category_id: contactCategory,
        contact_reason_id: contactReason,
        message,
        FirstName: firstName,
        LastName: lastName,
        Address1: address1,
        Address2: address2,
        city,
        state,
        zipCode,
        email,
        emailRequestFeedback,
        callRequestFeedback,
        receiveEmailMarketing,
        status,
      }
    );
    if (response.status === 200) {
      toast.success("Contact Us Submitted Successfully");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mx-auto p-4 max-w-screen-xl items-start">
      {/* Left Side - Form */}
      <div className="bg-white p-6 w-full md:w-2/3 lg:w-3/4 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Email Us</h1>
        <p className="my-4">
          Have a question about caring for your dog or cat? Wondering about one
          of our products? Ask away! That's what we're here for. Submit your
          comment or question in the form below.
        </p>
        <form className="space-y-4" onSubmit={handleAddContact}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Reason for Contact */}
            <label htmlFor="contactReason" className="block w-full">
              Contact Category
              <select
                id="contactReason"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={contactCategory}
                onChange={(e) => setContactCategory(e.target.value)}
                required
              >
                <option value="">Please select</option>
                {contactCategories.map((category) => (
                  <option
                    key={category.contact_us_category_id}
                    value={category.contact_us_category_id}
                  >
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            {/* Specific Reason */}
            <label htmlFor="specificReason" className="block w-full">
              Contact Reason
              <select
                id="specificReason"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={contactReason}
                onChange={(e) => setContactReason(e.target.value)}
                required
              >
                <option value="">Please select</option>
                {contactReasons.map((reason) => (
                  <option
                    key={reason.contact_us_reason_id}
                    value={reason.contact_us_reason_id}
                  >
                    {reason.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="my-4 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          {/* Message Area */}
          <label htmlFor="message" className="block w-full">
            Your Message
            <textarea
              id="message"
              rows="5"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </label>
          <div className="border-b-2 my-4"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="State"
              className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="City"
              className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Address Line 1"
              className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ...other inputs */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailFeedback"
                className="mr-2 mb-2 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                checked={emailRequestFeedback}
                onChange={(e) =>
                  setEmailRequestFeedback(e.target.checked ? 1 : 0)
                }
              />
              <label
                htmlFor="emailFeedback"
                className="min-w-0 flex-1 text-gray-600"
              >
                Email Request for Feedback
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="callFeedback"
                className="mr-2 mb-2 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                checked={callRequestFeedback}
                onChange={(e) =>
                  setCallRequestFeedback(e.target.checked ? 1 : 0)
                }
              />
              <label
                htmlFor="callFeedback"
                className="min-w-0 flex-1 text-gray-600"
              >
                Call Request for Feedback
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailMarketing"
                className="mr-2 mb-2 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                checked={receiveEmailMarketing}
                onChange={(e) =>
                  setReceiveEmailMarketing(e.target.checked ? 1 : 0)
                }
              />
              <label
                htmlFor="emailMarketing"
                className="min-w-0 flex-1 text-gray-600"
              >
                Opt-in for Email Marketing
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Side - Contact Info */}
      <div className="p-6 rounded-md bg-slate-100 shadow w-full md:w-1/3 lg:w-1/4">
        <div className="flex items-center gap-4 p-4 bg-white rounded-md mb-4">
          <FaPhoneAlt className="text-indigo-600 h-8 w-8" />
          <span>
            <h2 className="text-xl font-bold">Call Us</h2>
            <p>
              <a
                href="tel:+234-803-123-4567"
                className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out"
              >
                +234-803-123-4567
              </a>
            </p>
          </span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-md mb-4">
          <TbMailbox className="text-indigo-600 h-8 w-8" />
          <span>
            <h2 className="text-xl font-bold">Write Us</h2>
            <p>
              <a
                href="mailto:regexbyte@gmail.com"
                className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out"
              >
                Office of Consumer Affairs
              </a>
            </p>
          </span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-md">
          <GiHospitalCross className="text-indigo-600 h-6 w-6" />
          <span>
            <h2 className="text-xl font-bold">Visit Us</h2>
            <p>WowPetsPalace</p>
            <p>1234 Main Street</p>
            <p>Anywhere, USA 12345</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactUsForm;
