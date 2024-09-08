import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import tokenExpired from "../../utils/tokenExpired";
import api from "../../axios/api";

const AddContactReason = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleAddContactReason = (e) => {
    e.preventDefault();
    const formData = { title };

    api
      .post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/createContactUsReason`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/contact us", { replace: true });
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error adding contact reason", error);
        toast.error("Failed to add contact reason. Please try again.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container px-4 md:px-0 max-w-3xl">
        <h2 className="text-xl text-center font-semibold mb-8">
          Add Contact Reason
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleAddContactReason}>
            <div className="mb-5">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg
                              focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContactReason;
