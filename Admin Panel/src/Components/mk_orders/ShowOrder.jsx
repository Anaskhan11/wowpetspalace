import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";
// import { PlusCircleIcon } from "@heroicons/react/24/solid";
const ShowOrder = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrder = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/product/getAllOrder`
    );
    console.log(res);
    setOrders(res.data.result);
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `${import.meta.env.VITE_APP_BASE_URL}/product/deleteOrder/${id}`
    );
    if (res.status === 200) {
      toast.success(res.data.message);
      fetchOrder();
      fetchOrder();
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="p-8 mt-16">
      <div className="bg-white p-2 shadow rounded-lg">
        <nav className="text-sm text-gray-500 mb-4">
          <span>Dashboard</span> / <span>Orders</span>
        </nav>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search"
            className="border rounded py-2 px-4 mr-2"
          />
          <span className="mr-2">Transactions Status</span>
          <select className="border rounded py-2 px-4 mr-2">
            <option>Pending</option>
            <option>Completed</option>
            <option>Canceled</option>
          </select>
          <input type="date" className="border rounded py-2 px-4 mr-2" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Search
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Reset
          </button>

          <div className="flex items-center ml-auto">
            <Link
              to="/transactionrecords"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Transaction Rocords List
            </Link>
          </div>
        </div>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User info </th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Date & Time</th>

              <th className="py-2 px-4 border-b">Edit</th>
              <th className="py-2 px-4 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-4 px-4  border-b h-20 align-middle flex items-center">
                    {order.firstName}{" "}
                    <span className="">( Contact: {order.contact_phone} )</span>
                  </td>

                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {order.statusTitle === "Pending" && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                    {order.statusTitle === "On Delivery" && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded">
                        On Delivery
                      </span>
                    )}
                    {order.statusTitle === "Completed" && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {order.quantity} items
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {order.added_date}
                  </td>

                  <td className="py-4 px-4 border-b h-20 align-middle">
                    <Link
                      className="text-blue-500"
                      to={`/orderdetails/${order.transaction_id}`}
                    >
                      ✏️
                    </Link>
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(order.transaction_id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowOrder;
