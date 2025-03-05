import { useState } from "react";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-100">
      {/* Thông tin giao hàng */}
      <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
      <p className="text-sm text-gray-600 mb-3">
        Bạn đã có tài khoản? <a href="#" className="text-blue-600">Đăng nhập</a>
      </p>

      <div className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          className="w-full p-3 border border-gray-300 rounded-md"
          value={formData.fullName}
          onChange={handleChange}
        />
        <div className="flex space-x-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-1/2 p-3 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            className="w-1/2 p-3 border border-gray-300 rounded-md"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          className="w-full p-3 border border-gray-300 rounded-md"
          value={formData.address}
          onChange={handleChange}
        />
        <div className="grid grid-cols-3 gap-4">
          <select
            name="city"
            className="p-3 border border-gray-300 rounded-md"
            value={formData.city}
            onChange={handleChange}
          >
            <option value="">Chọn tỉnh / thành</option>
            {/* Add options dynamically */}
          </select>
          <select
            name="district"
            className="p-3 border border-gray-300 rounded-md"
            value={formData.district}
            onChange={handleChange}
          >
            <option value="">Chọn quận / huyện</option>
          </select>
          <select
            name="ward"
            className="p-3 border border-gray-300 rounded-md"
            value={formData.ward}
            onChange={handleChange}
          >
            <option value="">Phường / Xã</option>
          </select>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            className="w-4 h-4"
            onChange={handleChange}
          />
          <span>Thanh toán tại nhà</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="bankTransfer"
            className="w-4 h-4"
            onChange={handleChange}
          />
          <span>Chuyển khoản: <strong>VPbank 01234567876 - Nguyen Van A</strong></span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="transfer"
            className="w-4 h-4"
            onChange={handleChange}
          />
          <span>Thanh toán chuyển khoản</span>
        </label>
      </div>

      {/* Link giỏ hàng */}
      <div className="mt-6">
        <a href="#" className="text-blue-600 text-sm">← Giỏ hàng</a>
      </div>
    </div>
  );
};

export default CheckoutForm;
