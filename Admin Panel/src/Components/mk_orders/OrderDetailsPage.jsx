import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null); // Single order object
  const [orderStatus, setOrderStatus] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [showDefaultStatus, setShowDefaultStatus] = useState(true);
  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/product/getAllOrderById/${id}`
      );
      console.log(res, "====dfdfdf=====");
      setOrder(res.data); // Assuming the API returns an array
    } catch (error) {
      console.error("Error fetching order:", error);
      setOrder(null);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/product/getAllOrderStatus`
      );
      console.log(res, "1111111111111111111111");
      setOrderStatus(res.data); // Assuming the API returns an array
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  useEffect(() => {
    fetchOrder();
    fetchOrderStatus();
  }, [id]);

  const handleStatusChange = (e) => {
    setSelectedStatusId(e.target.value); // Store selected status ID
  };
  const handleUpdateStatus = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/product/updateOrderStatus/${id}`,
        {
          status: selectedStatusId, // Send selected status ID in request body
        }
      );
      console.log(res.data, "1010010101");
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!order) {
    return <div>Loading...</div>; // Handle loading or error state
  }
  // Calculate total item amount
  const totalItemAmount = order.products.reduce((acc, product) => {
    return acc + product.originalPrice * product.quantity;
  }, 0);

  // Calculate final total including shipping cost
  const finalTotalAmount = totalItemAmount + (order.shipping_cost || 0);

  return (
    <div className="max-w-screen-xl mt-20 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Transaction Detail</h1>
        <div className="float-right">
          Date: {new Date(order.added_date).toLocaleDateString()}
        </div>
      </div>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className="mb-2">Billing Address</h2>
          <p className="text-sm">
            Name: {order.billing_first_name} {order.billing_last_name}
          </p>
          <p className="text-sm">Address 1: {order.billing_address_1}</p>
          <p className="text-sm">Address 2: {order.billing_address_2}</p>
          <p className="text-sm">Phone: {order.billing_phone}</p>
          <p className="text-sm">Email: {order.billing_email}</p>
        </div>
        <div className="flex-1">
          <h2 className="mb-2">Shipping Address</h2>
          <p className="text-sm">
            Name: {order.shipping_first_name} {order.shipping_last_name}
          </p>
          <p className="text-sm">Address 1: {order.shipping_address_1}</p>
          <p className="text-sm">Address 2: {order.shipping_address_2}</p>
          <p className="text-sm">Phone: {order.shipping_phone}</p>
          <p className="text-sm">Email: {order.shipping_email}</p>
        </div>
        <div className="flex-1">
          <h2 className="mb-2">Invoice 202011</h2>
          <select
            className="border rounded px-2 py-1 mr-2"
            value={selectedStatusId}
            onChange={(e) => {
              handleStatusChange(e);
            }}
          >
            {/* Show the current status first */}
            <option value={order.statusId}>{order.statusTitle}</option>

            {/* Show all other statuses, excluding the current status */}
            {orderStatus
              .filter((status) => {
                // Always exclude the current status to avoid duplication
                return status.id !== order.statusId;
              })
              .map((status, index) => (
                <option key={index} value={status.id}>
                  {status.title}
                </option>
              ))}
          </select>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleUpdateStatus}
          >
            Update
          </button>
          <p className="text-sm">
            Account: {order.balance_amount} {order.currency_symbol}
          </p>
        </div>
      </div>

      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="">
            <th className="text-left p-2">Product Name</th>
            <th className="text-left p-2">Product Price</th>
            <th className="text-left p-2">Qty</th>
            <th className="text-left p-2">Discount(%)</th>
            <th className="text-left p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, index) => (
            <tr key={index} className="bg-gray-100">
              <td className="p-2">
                <p className="text-sm">{product.productName}</p>
                <p className="text-sm">Product Unit: {product.productUnit}</p>
                <p className="text-sm">
                  Shipping Cost: {order.shipping_amount} {order.currency_symbol}
                </p>
              </td>
              <td className="p-2">
                {order.sub_total_amount} {order.currency_symbol}
              </td>
              <td className="p-2">{order.total_item_count}</td>
              <td className="p-2">0% off</td>
              <td className="p-2">
                {order.sub_total_amount}
                {order.currency_symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between">
        <div className="flex-1">
          <p className="text-sm">Payment Method: {order.payment_method}</p>
          <p className="text-sm">Memo: {order.memo || "No memo"}</p>
        </div>
        <div className="flex-1">
          <hr />
          <div className="flex justify-between mb-1 border-bottom p-2">
            <span>Coupon Discount Amount (-):</span>
            <span>
              {order.coupon_discount_amount || 0} {order.currency_symbol}
            </span>
          </div>
          <div className="flex justify-between mb-1 border-bottom p-2">
            <span>Item Sub Total:</span>
            <span>
              {order.sub_total_amount} {order.currency_symbol}
            </span>
          </div>
          <div className="flex justify-between mb-1 border-bottom p-2">
            <span>Overall Tax (0%) : (+)</span>
            <span>
              {order.tax_amount || 0} {order.currency_symbol}
            </span>
          </div>
          <div className="flex justify-between mb-1 border-bottom p-2">
            <span>Shipping Cost (Using): (+)</span>
            <span>
              {order.shipping_amount} {order.currency_symbol}
            </span>
          </div>
          <div className="flex justify-between mb-1 border-bottom p-2">
            <span>Shipping Tax (20%) : (+)</span>
            <span>
              {order.shipping_tax_percent || 0} {order.currency_symbol}
            </span>
          </div>
          <div className="flex justify-between font-bold border-bottom p-2">
            <span>Total Balance Amount:</span>
            <span>
              {order.total_item_amount} {order.currency_symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
