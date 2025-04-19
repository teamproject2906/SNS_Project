import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ModalDetail from "../share/ModalDetail";

Modal.setAppElement("#root");

const OrderTable = () => {
  const [orders] = useState([
    {
      id: 1,
      userId: 5,
      orderItems: [{ id: 2001, productId: 301, orderId: 1001, quantity: 2 }],
      totalAmount: 236000,
      orderDate: "2025-04-18T08:37:38.726Z",
      shippingDate: "2025-04-20T08:37:38.726Z",
      orderStatus: "PENDING",
      paymentMethod: "VNPay",
    },
    {
      id: 2,
      userId: 3,
      orderItems: [
        { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
        { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
      ],
      totalAmount: 578000,
      orderDate: "2025-04-18T10:15:22.123Z",
      shippingDate: "2025-04-21T10:15:22.123Z",
      orderStatus: "ACCEPT",
      paymentMethod: "COD",
    },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Not updated";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format price with thousand separators
  const formatPrice = (price) => {
    if (!price) return "Not updated";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const id = order.id ? order.id.toString().toLowerCase() : "";
    const userId = order.userId ? order.userId.toString().toLowerCase() : "";
    const totalAmount = order.totalAmount
      ? order.totalAmount.toString().toLowerCase()
      : "";
    const orderStatus = order.orderStatus
      ? order.orderStatus.toLowerCase()
      : "";
      const paymentMethod = order.paymentMethod
      ? order.paymentMethod.toLowerCase()
      : "";
    return (
      id.includes(searchTerm) ||
      userId.includes(searchTerm) ||
      totalAmount.includes(searchTerm) ||
      orderStatus.includes(searchTerm) ||
      paymentMethod.includes(searchTerm)
    );
  });

  // Open detail modal
  const openDetailModal = (id) => {
    const order = orders.find((order) => order.id === id);
    if (order) {
      setSelectedOrder(order);
      setModalDetailIsOpen(true);
    }
  };

  // Close detail modal
  const closeDetailModal = () => {
    setModalDetailIsOpen(false);
    setSelectedOrder(null);
  };

  // Custom styles for DataTable
  const customStyles = {
    cells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        padding: "1px",
      },
    },
    headCells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        padding: "1px",
        fontSize: "14px",
      },
    },
  };

  // Columns for DataTable
  const columns = [
    {
      name: "ID",
      selector: (row) => (row.id ? row.id : "Null"),
      sortable: true,
      style: { width: "100px" },
    },
    {
      name: "UserID",
      selector: (row) => (row.userId ? row.userId : "Null"),
      sortable: true,
      style: { width: "100px" },
    },
    {
      name: "Total",
      selector: (row) =>
        row.totalAmount ? `${formatPrice(row.totalAmount)}đ` : "Null",
      sortable: true,
      style: { width: "120px" },
    },
    {
      name: "Order Date",
      selector: (row) => (row.orderDate ? formatDate(row.orderDate) : "Null"),
      sortable: true,
      style: { width: "150px" },
    },
    {
      name: "Order Status",
      selector: (row) => row.orderStatus,
      sortable: true,
      cell: (row) => {
        let bgColorClass = "";
        switch (row.orderStatus) {
          case "PENDING":
            bgColorClass = "bg-yellow-300 text-black";
            break;
          case "ACCEPT":
            bgColorClass = "bg-green-600 text-white";
            break;
          case "DECLINE":
            bgColorClass = "bg-red-600 text-white";
            break;
          default:
            bgColorClass = "bg-yellow-300 text-black";
        }

        return (
          <div>
            <select
              className={`w-full p-2 border rounded-lg ${bgColorClass}`}
              value={row.orderStatus}
              disabled // Temporarily disabled since handleSetStatus is commented
            >
              <option value="PENDING" className="bg-yellow-300 text-black">
                PENDING
              </option>
              <option value="ACCEPT" className="bg-green-600 text-white">
                ACCEPT
              </option>
              <option value="DECLINE" className="bg-red-600 text-white">
                DECLINE
              </option>
            </select>
          </div>
        );
      },
      style: { width: "150px" },
    },
    {
      name: "Payment Method",
      selector: (row) => (row.paymentMethod ? row.paymentMethod : "Null"),
      sortable: true,
      style: { width: "150px" },
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="bg-blue-500 text-white px-2 py-2 rounded"
          onClick={() => openDetailModal(row.id)}
        >
          View
        </button>
      ),
      style: { width: "100px" },
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Orders</h3>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-lg"
            onChange={handleSearch}
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredOrders}
        pagination
        customStyles={customStyles}
      />
      <ModalDetail
        isOpen={modalDetailIsOpen}
        onClose={closeDetailModal}
        title="Order Detail"
      >
        {selectedOrder ? (
          <div className="space-y-4">
            <div className="id_form">
              <label>Order ID:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={selectedOrder.id || "Not updated"}
                readOnly
              />
            </div>
            <div className="user_id_form pt-4">
              <label>User ID:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={selectedOrder.userId || "Not updated"}
                readOnly
              />
            </div>
            <div className="order_items_form pt-4">
              <label>Order Items:</label>
              <textarea
                className="w-full p-2 border rounded-lg"
                value={
                  selectedOrder.orderItems && selectedOrder.orderItems.length > 0
                    ? selectedOrder.orderItems
                        .map(
                          (item) =>
                            `Product ID: ${item.productId}, Quantity: ${item.quantity}`
                        )
                        .join("\n")
                    : "Not updated"
                }
                readOnly
              />
            </div>
            <div className="total_amount_form pt-4">
              <label>Total Amount:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={
                  selectedOrder.totalAmount
                    ? `${formatPrice(selectedOrder.totalAmount)}đ`
                    : "Not updated"
                }
                readOnly
              />
            </div>
            <div className="order_date_form pt-4">
              <label>Order Date:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={
                  selectedOrder.orderDate
                    ? formatDate(selectedOrder.orderDate)
                    : "Not updated"
                }
                readOnly
              />
            </div>
            <div className="shipping_date_form pt-4">
              <label>Shipping Date:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={
                  selectedOrder.shippingDate
                    ? formatDate(selectedOrder.shippingDate)
                    : "Not updated"
                }
                readOnly
              />
            </div>
            <div className="order_status_form pt-4">
              <label>Order Status:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={selectedOrder.orderStatus || "Not updated"}
                readOnly
              />
            </div>
            <div className="payment_method_form pt-4">
              <label>Payment Method:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={selectedOrder.paymentMethod || "Not updated"}
                readOnly
              />
            </div>
          </div>
        ) : (
          <p>No order selected</p>
        )}
      </ModalDetail>
    </div>
  );
};

export default OrderTable;