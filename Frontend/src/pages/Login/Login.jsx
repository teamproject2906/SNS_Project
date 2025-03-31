import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { getToken, setToken, setUserInfo } from "./app/static";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginUser = async (event) => {
    event.preventDefault(); // Ngăn reload trang
    if (!username || !password) {
      toast.error("Email hoặc mật khẩu không hợp lệ.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/Authentication/Authenticate",
        { username, password }
      );
      console.log("Login Response:", res.data);

      if (res.data && res.data.access_token) {
        setToken(res.data.access_token); // Lưu access_token vào localStorage
        setUserInfo(res.data); // Nếu có thêm thông tin user, bạn có thể lưu tại đây
        console.log("Token:", res.data.access_token);
        console.log("Saved token:", getToken());
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        throw new Error("Access token not found in response.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);

      // Luôn hiển thị thông báo lỗi khi đăng nhập thất bại
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <ToastContainer />
      <h1 className="text-xl font-bold mb-6 border-b pb-2">Đăng nhập</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Đăng Nhập */}
        <div className="p-6 shadow-lg border rounded-md">
          <h2 className="text-lg font-semibold mb-4">Thông tin</h2>
          <form onSubmit={handleLoginUser}>
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 text-sm font-semibold"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <div className="mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="flex items-center hover:underline"
            >
              <FaLock className="mr-1" />
              Quên mật khẩu
            </Link>
          </div>
        </div>

        {/* Đăng Ký Tài Khoản */}
        <div className="p-6 shadow-lg border rounded-md">
          <h2 className="text-lg font-semibold mb-4">Đăng kí tài khoản mới</h2>
          <p className="text-sm mb-6">
            Đăng ký tài khoản ngay để có thể mua hàng nhanh chóng và dễ dàng
            hơn! Ngoài ra còn có rất nhiều chính sách và ưu đãi cho các thành
            viên.
          </p>
          <Link
            to="/register"
            className="block bg-black text-white py-2 rounded-md text-center hover:bg-gray-800 text-sm font-semibold"
          >
            TẠO TÀI KHOẢN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
