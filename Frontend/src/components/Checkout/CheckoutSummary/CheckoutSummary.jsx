import { useState } from "react";

const CheckoutSummary = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [subtotal, setSubtotal] = useState(1600000); // Giá tạm tính
  const [shippingFee, setShippingFee] = useState(0); // Phí vận chuyển
  const [total, setTotal] = useState(subtotal + shippingFee); // Tổng tiền

  const handleApplyDiscount = () => {
    alert(`Mã giảm giá "${discountCode}" đã được áp dụng (Demo)`);
    setDiscountCode("");
  };

  return (
    <div className="w-full bg-white shadow-lg p-8 rounded-lg">
      {/* Sản phẩm */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center">
          <img
            src="https://product.hstatic.net/1000026602/product/dsc03170_2dfd2355eeec459b8d7d634b0214d5ca.jpg"
            alt="Áo bomber da rắn"
            className="w-16 h-16 rounded-md mr-4 object-cover"
          />
          <div>
            <p className="text-lg font-semibold">Áo bomber da rắn - XL</p>
            <span className="text-sm text-gray-500">Số lượng: 1</span>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-900">1,600,000₫</p>
      </div>

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
