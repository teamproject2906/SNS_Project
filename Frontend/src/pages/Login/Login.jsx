import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaLock } from "react-icons/fa";
import axios from "axios";
import { getToken, setToken, setUserInfo } from "./app/static";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Import thư viện decode token
import { useUser } from "../../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser(); // Lấy setUser để cập nhật thông tin user
  const navigate = useNavigate();

  const handleLoginUser = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      toast.error("Email hoặc mật khẩu không hợp lệ.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/Authentication/Authenticate",
        { username, password }
      );

      if (res.data && res.data.access_token) {
        const token = res.data.access_token;
        setToken(`${token}`); // Lưu token với định dạng Bearer
        console.log("Token: " + token);
        console.log("user info:", res.data);

        // Giải mã token để lấy thông tin user
        const decodedUser = jwtDecode(token);
        setUserInfo(decodedUser); // Lưu thông tin user vào localStorage

        console.log("Decoded User:", decodedUser);
        setUser(decodedUser); // Cập nhật thông tin user trong Context

        toast.success("Đăng nhập thành công!");

        // Điều hướng theo role
        if (res.data.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Access token không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  };
  
  const registerWithGoogle = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/oauth2/redirectToGoogle",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data && res.data.auth_url) {
        window.location.href = res.data.auth_url; // Chuyển hướng đến Google
      } else {
        toast.error("Không tìm thấy URL chuyển hướng!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập với Google!");
      console.error(error);
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
          <p className="text-center text-sm mb-4 text-gray-500">
            Hoặc đăng nhập với
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-500"
              onClick={registerWithGoogle}
            >
              <FaGoogle className="mr-2" />
              Google
            </button>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-500">
              <FaFacebook className="mr-2" />
              Facebook
            </button>
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
