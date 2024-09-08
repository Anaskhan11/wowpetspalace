import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";
// import { PlusCircleIcon } from "@heroicons/react/24/solid";
const OrderLogs = () => {
  const [log, setLog] = useState([]);

  const fetchOrder = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/product/getTransactionRecord`
    );
    console.log(res, "logs=============");
    setLog(res.data);
  };
  useEffect(() => {
    fetchOrder();
  }, []);

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
        </div>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Transaction ID </th>
              <th className="py-2 px-4 border-b">Order ID </th>
              <th className="py-2 px-4 border-b">amount </th>
              <th className="py-2 px-4 border-b">Currency</th>
              <th className="py-2 px-4 border-b">Payment Method </th>
              <th className="py-2 px-4 border-b">Gateway Response</th>
              <th className="py-2 px-4 border-b">Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {log &&
              log.map((log) => (
                <tr key={log.id}>
                  <td className="py-4 px-4  border-b h-20 align-middle flex items-center">
                    {log.transaction_id}
                  </td>

                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {log.order_id}{" "}
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {log.amount}
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {log.currency}
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {log.payment_method}
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {log.gateway_response}
                  </td>
                  <td className="py-4 px-4 border-b h-20 align-middle">
                    {log.transaction_date}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderLogs;
