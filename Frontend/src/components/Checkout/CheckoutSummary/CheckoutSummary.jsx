import { useEffect, useState, useRef } from "react";
import { useCart } from "../../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../pages/Login/app/static";
import { checkoutVnPay } from "../../../services/paymentService";
import { toast } from "react-toastify";
import { useUser } from "../../../context/UserContext";
import { createOrder } from "../../../services/orderService";

const CheckoutSummary = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    getTotalPrice,
    getPriceAfterPromotion,
    paymentMethod,
    address,
  } = useCart();
  const { user } = useUser();
  const shippingFee = 0; // Phí vận chuyển
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Calculate subtotal and total
  const subtotal = getTotalPrice();
  const calculateTotal = () => {
    if (selectedVoucher && !selectedVoucher.timeLeft.isExpired) {
      return subtotal * (1 - selectedVoucher.discount) + shippingFee;
    }
    return subtotal + shippingFee;
  };
  const total = calculateTotal();

  // Fetch vouchers
  const fetchVoucher = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`http://localhost:8080/api/v1/shop`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const vouchersWithTimeLeft = res.data.map((voucher) => {
        const endDate = new Date(voucher.endDate);
        const now = new Date();
        const timeLeftMs = endDate - now;
        const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
        const isExpired = timeLeftMs <= 0;

        return {
          ...voucher,
          timeLeft: {
            days: daysLeft,
            isExpired,
          },
        };
      });
      setVouchers(vouchersWithTimeLeft);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleCreateOrder = async (payload) => {
    try {
      await createOrder(payload);
      toast.success("Đơn hàng đã được tạo thành công");
      navigate("/order");
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng");
      throw new Error(error);
    }
  };

  const handleCheckout = async () => {
    try {
      if (paymentMethod === "CREDIT") {
        localStorage.setItem(
          "checkout",
          JSON.stringify({
            userId: user.id,
            totalAmount: total,
            voucher: selectedVoucher,
            address: address,
          })
        );
        const response = await checkoutVnPay({
          amount: total,
        });
        window.location.href = response.data.paymentUrl;
      } else {
        const payload = {
          userId: user.id,
          orderItems: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item?.color,
            color: item?.colorChart?.value,
          })),
          address: {
            id: address?.id,
          },
          totalAmount: total,
          voucherId: selectedVoucher?.id,
          orderStatus: "PENDING",
          paymentMethod: "COD",
          orderDate: new Date().toISOString(),
          shippingDate: new Date(
            new Date().getTime() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
        handleCreateOrder(payload);
      }
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle voucher selection
  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setIsDropdownOpen(false);
  };

  // Copy voucher code to clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Đã sao chép mã: " + code);
  };

  return (
    <div className="w-full bg-white shadow-lg p-8 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

      {/* Products */}
      {cartItems.length === 0 ? (
        <div className="text-center py-4 border-b pb-6">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
          <Link
            to="/cart"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Quay lại giỏ hàng
          </Link>
        </div>
      ) : (
        <div className="border-b pb-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between mb-6 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start">
                <img
                  src={item.imageUrl}
                  alt={item.product.productName}
                  className="w-16 h-16 rounded-md mr-4 object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {item.product.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Màu: {item.product.color}
                  </p>
                  <p className="text-sm text-gray-600">
                    Kích thước: {item.product.sizeChart.value}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                  {item.product.promotion && (
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-sm text-gray-500 line-through">
                        {item.unitPrice.toLocaleString()}₫
                      </span>
                      <span className="text-sm text-red-600 font-semibold">
                        {getPriceAfterPromotion(item).toLocaleString()}₫
                      </span>
                      <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                        -{item.product.promotion.discount * 100}%
                      </span>
                    </div>
                  )}
                  {!item.product.promotion && (
                    <p className="text-sm text-gray-700 mt-1">
                      {item.unitPrice.toLocaleString()}₫
                    </p>
                  )}
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 ml-4">
                {(
                  getPriceAfterPromotion(item) * item.quantity
                ).toLocaleString()}
                ₫
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Voucher Section */}
      <div className="mt-6 border-b pb-6">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-4 border border-gray-200 rounded-lg text-base bg-white flex justify-between items-center hover:border-blue-500 transition-colors"
          >
            <span className="text-gray-700">
              {selectedVoucher
                ? `${selectedVoucher.voucherCode} - Giảm ${
                    selectedVoucher.discount * 100
                  }%`
                : "Chọn mã giảm giá"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <ul className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              <li
                className="p-4 text-base text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                onClick={() => handleSelectVoucher(null)}
              >
                Không sử dụng mã giảm giá
              </li>
              {vouchers.map((voucher) => (
                <li
                  key={voucher.id}
                  className={`p-4 border-b border-gray-100 last:border-b-0 ${
                    voucher.timeLeft.isExpired || !voucher.isActive
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "hover:bg-gray-50 cursor-pointer"
                  }`}
                  onClick={() =>
                    !voucher.timeLeft.isExpired && voucher.isActive
                      ? handleSelectVoucher(voucher)
                      : null
                  }
                >
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {voucher.voucherCode}
                        </span>
                        {!voucher.timeLeft.isExpired && voucher.isActive && (
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyCode(voucher.voucherCode);
                            }}
                          >
                            Sao chép
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {voucher.timeLeft.isExpired ? (
                          <span className="text-red-500">Hết hạn</span>
                        ) : (
                          `Hết hạn sau ${voucher.timeLeft.days} ngày`
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {"Áp dụng tại thanh toán"}
                      </p>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        voucher.timeLeft.isExpired || !voucher.isActive
                          ? "text-gray-400"
                          : "text-green-600"
                      }`}
                    >
                      Giảm {voucher.discount * 100}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedVoucher && !selectedVoucher.timeLeft.isExpired && (
          <div className="mt-3 flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-700">
              Đã áp dụng voucher {selectedVoucher.voucherCode} - Giảm{" "}
              {selectedVoucher.discount * 100}%
            </p>
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => handleCopyCode(selectedVoucher.voucherCode)}
            >
              Sao chép mã
            </button>
          </div>
        )}
      </div>

      {/* Subtotal & Total */}
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
      </div>

      {/* Total */}
      <div className="flex justify-between mt-6 text-xl font-bold text-gray-900">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()}₫</span>
      </div>

      {/* Checkout Button */}
      <button
        className="w-full bg-black text-white py-4 mt-6 text-center text-lg font-semibold rounded-lg hover:bg-gray-900 transition-all"
        onClick={handleCheckout}
      >
        Thanh toán
      </button>
    </div>
  );
};

export default CheckoutSummary;
