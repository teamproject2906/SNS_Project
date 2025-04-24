import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getOrderById } from "../../services/orderService";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { DEFAULT_IMAGE } from "../../constants/ImageConstant";

const OrderDetailModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (open && orderId) {
      const fetchOrder = async () => {
        try {
          const order = await getOrderById(orderId);
          setOrder(order);
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error(error.response?.data.message || "Error fetching order");
        }
      };
      fetchOrder();
    }
  }, [open, orderId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>
          <X className="w-6 h-6" onClick={onClose} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Người đặt</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={order?.username}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ngày đặt hàng</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={
                order?.orderDate
                  ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                  : ""
              }
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={order?.orderStatus}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Kiểu thanh toán</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={order?.paymentMethod}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tổng tiền</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={order?.totalAmount}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={order?.address?.phoneNumber}
              readOnly
            />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium">Địa chỉ giao hàng</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={order?.address?.addressDetail}
              readOnly
            />
          </div>
        </div>
        <div className="mt-5 ">
          <h2 className="text-xl font-bold">Sản phẩm đã đặt</h2>
          {order?.orderItems.map((item) => (
            <div
              className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center"
              key={item.id}
            >
              <img
                src={item.imageUrl || DEFAULT_IMAGE}
                alt="order"
                className="w-20 h-20 border-2 border-gray-200"
              />
              <div className="flex flex-col flex-1 h-full">
                <h3>Tên sản phẩm: {item.productName}</h3>
                <p className="text-sm text-gray-500">Kích cỡ: {item.size}</p>
                <p className="text-sm">Màu: {item.color}</p>
              </div>
              <p className="text-sm">Số lượng x {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;

OrderDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
};
