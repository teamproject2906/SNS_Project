import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { Link } from "react-router-dom";

const CheckoutSummary = () => {
  const [discountCode, setDiscountCode] = useState("");
  const { cartItems, getTotalPrice } = useCart();
  const shippingFee = 0; // Phí vận chuyển
  
  // Calculate subtotal and total from cart items
  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  const handleApplyDiscount = () => {
    alert(`Mã giảm giá "${discountCode}" đã được áp dụng (Demo)`);
    setDiscountCode("");
  };

  return (
    <div className="w-full bg-white shadow-lg p-8 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
      
      {/* Sản phẩm */}
      {cartItems.length === 0 ? (
        <div className="text-center py-4 border-b pb-6">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
          <Link to="/cart" className="text-blue-600 hover:underline mt-2 inline-block">
            Quay lại giỏ hàng
          </Link>
        </div>
      ) : (
        <div className="border-b pb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-16 rounded-md mr-4 object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{item.productName}</p>
                  <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {(item.unitPrice * item.quantity).toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mã giảm giá */}
      <div className="mt-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg text-base"
          />
          <button
            onClick={handleApplyDiscount}
            className="px-5 py-3 bg-black text-white rounded-lg text-base font-semibold hover:bg-gray-800 transition-all"
          >
            Sử dụng
          </button>
        </div>
      </div>

      {/* Tạm tính & Tổng tiền */}
      <div className="mt-6 text-base text-gray-700 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-semibold text-gray-900">
            {subtotal.toLocaleString()}₫
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-semibold text-gray-900">
            {shippingFee.toLocaleString()}₫
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Vui lòng{" "}
          <a href="#" className="text-blue-600 font-medium">
            Đăng nhập
          </a>{" "}
          để tiêu điểm tích lũy
        </p>
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-between mt-6 text-xl font-bold text-gray-900">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()}₫</span>
      </div>

      {/* Nút thanh toán */}
      <button className="w-full bg-black text-white py-4 mt-6 text-center text-lg font-semibold rounded-lg hover:bg-gray-900 transition-all">
        Thanh toán
      </button>
    </div>
  );
};

export default CheckoutSummary;