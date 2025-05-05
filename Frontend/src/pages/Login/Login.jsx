import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaLock } from "react-icons/fa";
import axios from "axios";
import { getToken, setToken, setUserInfo } from "./app/static";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Import thư viện decode token
import { useUser } from "../../context/UserContext";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useCart } from "../../context/CartContext";
import { useFavourite } from "../../context/FavouriteContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser(); // Lấy setUser để cập nhật thông tin user
  const navigate = useNavigate();
  const { setUser: setUserCart } = useCart();
  const { setUser: setUserWishlist } = useFavourite();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginUser = async (event) => {
    event.preventDefault();

    const newError = {};
    if (!username.trim() && !password.trim()) {
      newError.username = "Username cannot be blank";
      newError.password = "Password cannot be blank";
    }

    if (!username.trim()) {
      newError.username = "Username cannot be blank";
    }

    if (!password.trim()) {
      newError.password = "Password cannot be blank";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      return; // Có lỗi thì không tiếp tục
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/Authentication/Authenticate",
        { username, password }
      );

      if (res.data && res.data.access_token && res.data.user) {
        const token = res.data.access_token;
        setToken(`${token}`); // Lưu token với định dạng Bearer
        console.log("Token: " + token);
        console.log("user info:", res.data);

        // Giải mã token để lấy thông tin user
        setUserInfo(res.data.user); // Lưu thông tin user vào localStorage

        setUser(res.data.user); // Cập nhật thông tin user trong Context

        toast.success("Login successful", {
          autoClose: 1000,
          position: "top-right",
        });
        // Điều hướng theo role
        setUserCart(res.data.user);
        setUserWishlist(res.data.user);
        if (res.data.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Access token không hợp lệ.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        toast.error(error.response.data.message);
      }
    }
    setLoading(false);
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

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-xl font-bold mb-6 border-b pb-2">Login</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Đăng Nhập */}
        <div className="p-6 shadow-lg border rounded-md">
          <h2 className="text-lg font-semibold mb-4">Information</h2>
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
              {error.username && (
                <p className="text-red-500 text-sm mt-1">{error.username}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={showPasswordHandler}
                  >
                    {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                  </button>
                </span>
                {error.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
              </div>
            </div>
            <button
              aria-label="Login"
              disabled={loading}
              className={`w-full py-3 rounded text-sm font-medium shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {loading ? "On Progress..." : "LOGIN"}
            </button>
          </form>

          <div className="mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="flex items-center hover:underline"
            >
              <FaLock className="mr-1" />
              Forgot password
            </Link>
          </div>
          <p className="text-center text-sm mb-4 text-gray-500">
            Or sign in with
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-500"
              onClick={registerWithGoogle}
            >
              <FaGoogle className="mr-2" />
              Google
            </button>
          </div>
        </div>

        {/* Đăng Ký Tài Khoản */}
        <div className="p-6 shadow-lg border rounded-md">
          <h2 className="text-lg font-semibold mb-4">Create new account</h2>
          <p className="text-sm mb-6">
            Register an account now to make your purchases faster and easier.
            There are also many policies and incentives for members!
          </p>
          <Link
            to="/register"
            className="block bg-black text-white py-2 rounded-md text-center hover:bg-gray-800 text-sm font-semibold"
          >
            REGISTER NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
