import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";
import ModalDetail from "../share/ModalDetail";
import ModalUpdate from "../share/ModalUpdate";
import OrderDetailModal from "../Orders/OrderDetailModal";

Modal.setAppElement("#root");

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    orderItems: [{ id: "", productId: "", quantity: "", orderId: "" }],
    totalAmount: "",
    orderDate: "",
    shippingDate: "",
    orderStatus: "",
    paymentMethod: "",
  });

  const fetchOrder = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/api/v1/order-details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data.message || "Error fetching orders");
    }
  };

  // const handleGetProduct = async () => {
  //   try {
  //     const token = getToken();
  //     const res = await axios.get("http://localhost:8080/api/products/getAll", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (Array.isArray(res.data)) {
  //       setProducts(res.data);
  //     } else {
  //       console.error("Expected an array of products");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     toast.error("Error fetching products");
  //   }
  // };

  useEffect(() => {
    fetchOrder();
    // handleGetProduct();
  }, []);

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === Number(productId));
    return product ? product.productName : "Unknown Product"; // Adjusted to use productName
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not updated";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const formatPrice = (price) => {
    if (!price) return "Not updated";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const openDetailModal = (id) => {
    const order = orders.find((order) => order.id === id);
    if (order) {
      setSelectedOrder(order);
      setModalDetailIsOpen(true);
    }
  };

  const openEditModal = (id) => {
    const order = orders.find((order) => order.id === id);
    if (order) {
      setSelectedOrder(order);
      setFormData({
        userId: order.userId || "",
        orderItems:
          order.orderItems && order.orderItems.length > 0
            ? order.orderItems.map((item) => ({
                id: item.id || "",
                productId: item.productId || "",
                quantity: item.quantity || "",
                orderId: item.orderId || order.id,
              }))
            : [{ id: "", productId: "", quantity: "", orderId: order.id }],
        totalAmount: order.totalAmount || "",
        orderDate: formatDateForInput(order.orderDate) || "",
        shippingDate: formatDateForInput(order.shippingDate) || "",
        orderStatus: order.orderStatus || "",
        paymentMethod: order.paymentMethod || "",
      });
      setModalEditIsOpen(true);
    }
  };

  const closeDetailModal = () => {
    setModalDetailIsOpen(false);
    setSelectedOrder(null);
  };

  const closeEditModal = () => {
    setModalEditIsOpen(false);
    setSelectedOrder(null);
    setFormData({
      userId: "",
      orderItems: [{ id: "", productId: "", quantity: "", orderId: "" }],
      totalAmount: "",
      orderDate: "",
      shippingDate: "",
      orderStatus: "",
      paymentMethod: "",
    });
  };

  const handleRemoveOrderItem = (index) => {
    if (formData.orderItems.length > 1) {
      const newOrderItems = formData.orderItems.filter((_, i) => i !== index);
      setFormData({ ...formData, orderItems: newOrderItems });
    }
  };

  const handleOrderItemChange = (index, field, value) => {
    const newOrderItems = [...formData.orderItems];
    newOrderItems[index] = { ...newOrderItems[index], [field]: value };
    setFormData({ ...formData, orderItems: newOrderItems });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) {
      toast.error("No order selected for editing!");
      return;
    }

    if (
      !formData.userId ||
      !formData.totalAmount ||
      !formData.orderDate ||
      !formData.orderStatus ||
      !formData.paymentMethod ||
      formData.orderItems.some((item) => !item.productId || !item.quantity)
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    // Transform dates to ISO 8601 format (or match backend expectation)
    const formatDateForBackend = (dateString) => {
      if (!dateString) return null;
      // Assuming backend expects LocalDateTime (e.g., "2025-04-22T00:00:00")
      return `${dateString}T00:00:00`;
    };

    const orderData = {
      userId: Number(formData.userId),
      orderItems: formData.orderItems.map((item) => ({
        id: Number(item.id) || 0,
        productId: Number(item.productId),
        orderId: Number(item.orderId) || selectedOrder.id,
        quantity: Number(item.quantity),
      })),
      totalAmount: Number(formData.totalAmount),
      orderDate: formatDateForBackend(formData.orderDate),
      shippingDate: formData.shippingDate
        ? formatDateForBackend(formData.shippingDate)
        : null,
      orderStatus: formData.orderStatus,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/v1/order-details/${selectedOrder.id}`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order updated successfully!");
      fetchOrder();
      closeEditModal();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data.message || "Error updating order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const id = order.id ? order.id.toString().toLowerCase() : "";
    const userId = order.userId ? order.userId.toString().toLowerCase() : "";
    return id.includes(searchTerm) || userId.includes(searchTerm);
  });

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
          case "APPROVED":
            bgColorClass = "bg-green-300 text-white";
            break;
          case "REJECTED":
            bgColorClass = "bg-red-300 text-white";
            break;
          case "DELIVERING":
            bgColorClass = "bg-blue-600 text-white";
            break;
          case "COMPLETED":
            bgColorClass = "bg-green-600 text-white";
            break;
          case "CANCELED":
            bgColorClass = "bg-red-600 text-white";
            break;
          default:
            bgColorClass = "bg-yellow-300 text-black";
        }

        return (
          <div>
            <div className={`w-full p-2 border rounded-lg ${bgColorClass}`}>
              {row.orderStatus}
            </div>
          </div>
        );
      },
      style: { width: "150px" },
    },
    {
      name: "Payment Method",
      selector: (row) => (row.paymentMethod ? row.paymentMethod : "Null"),
      style: { width: "150px" },
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="bg-blue-500 text-white px-2 py-2 rounded mr-2"
            onClick={() => openDetailModal(row.id)}
          >
            View
          </button>
          <button
            className="bg-green-500 text-white px-2 py-2 rounded mr-2"
            onClick={() => openEditModal(row.id)}
          >
            Edit
          </button>
        </>
      ),
      style: { width: "150px" },
    },
  ];

  return (
    <div>
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
      <OrderDetailModal
        open={modalDetailIsOpen}
        onClose={closeDetailModal}
        orderId={selectedOrder?.id}
      />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Order"
        onSubmit={handleEditSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Order ID
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              value={selectedOrder?.id || ""}
              readOnly
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              User ID
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              readOnly
            />
          </div>
          <div className="field-group flex flex-col">
            <div className="layout_header flex flex-row">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 w-1/2">
                Product
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
            </div>
            {formData.orderItems.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="layout_body flex flex-row gap-2" key={item.id}>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
                    value={item.productId}
                    onChange={(e) =>
                      handleOrderItemChange(index, "productId", e.target.value)
                    }
                    key={item.id}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleOrderItemChange(index, "quantity", e.target.value)
                    }
                    readOnly // Keep readOnly if you don't want to edit quantity
                  />
                </div>
              </div>
            ))}
            {/* {formData.orderItems.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex flex-col w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Product
                  </label>

                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:transition duration-200 ml-1"
                    value={item.productId}
                    onChange={(e) =>
                      handleOrderItemChange(index, "productId", e.target.value)
                    }
                    key={item.id}
                    disabled // Keep disabled if you don't want to edit productId
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:transition duration-200"
                    value={item.quantity}
                    onChange={(e) =>
                      handleOrderItemChange(index, "quantity", e.target.value)
                    }
                    readOnly // Keep readOnly if you don't want to edit quantity
                  />
                </div>
              </div>
            ))} */}
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Total Amount
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({ ...formData, totalAmount: e.target.value })
              }
              readOnly
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Order Date
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              value={formData.orderDate}
              onChange={(e) =>
                setFormData({ ...formData, orderDate: e.target.value })
              }
              readOnly
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Shipping Date
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              value={formData.shippingDate}
              onChange={(e) =>
                setFormData({ ...formData, shippingDate: e.target.value })
              }
              readOnly
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Order Status
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:transition duration-200 ml-1"
              value={formData.orderStatus}
              onChange={(e) =>
                setFormData({ ...formData, orderStatus: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="DELIVERING">DELIVERING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Payment Method
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              readOnly
            />
          </div>
        </div>
      </ModalUpdate>
    </div>
  );
};

export default OrderTable;
