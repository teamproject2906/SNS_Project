import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { setToken, setUserInfo } from "../Login/app/static";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../../context/UserContext";

const Register = () => {
  const { setUser } = useUser(); // Lấy setUser để cập nhật thông tin user
  const [username, setUsername] = useState("");
  const [emailOrPhoneNumber, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    const trimmedEmail = emailOrPhoneNumber.toLowerCase().trim();
    if (!username || !trimmedEmail || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      setLoading(false);
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      toast.error("Email không hợp lệ!");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8080/Authentication/Register",
        {
          username,
          emailOrPhoneNumber: trimmedEmail,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Thêm dòng này nếu backend có session hoặc JWT
        }
      );

      // const res = await axios.post("https://6785f704f80b78923aa4e3be.mockapi.io/product", {
      //   username,
      //   email: trimmedEmail,
      //   password,
      // });
      console.log("Response from server:", res.data);

      if (res.data && res.data.access_token) {
        const token = res.data.access_token;
        setToken(`${token}`); // Lưu token với định dạng Bearer
        console.log("Token: " + token);
        console.log("user info:", res.data);

        // Giải mã token để lấy thông tin user
        const decodedUser = jwtDecode(token);
        setUserInfo(decodedUser); // Lưu thông tin user vào localStorage

        console.log("Decoded User:", decodedUser);
        setUser(decodedUser); // Cập nhật thông tin user trong context
        // Display "Register successful" message
        toast.success("Registration successful", {
          autoClose: 2000, // Display for 2 seconds
          position: "top-right",
        });

        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000); // 2-second delay to match the toast duration
      } else {
        throw new Error("Token not found in response.");
      }
      // toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      // navigate("/");
      console.log(res.data);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error(error.response.data.message);
            break;
          case 500:
            toast.error("Lỗi máy chủ, vui lòng thử lại sau!");
            break;
          default:
            toast.error(error.response.data.message || "Có lỗi xảy ra!");
        }
      } else {
        toast.error("Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!");
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

      console.log("Redirect URL:", res.data);

      if (res.data && res.data.auth_) {
        // Chuyển hướng trình duyệt tới URL Google OAuth
        window.location.href = res.data.auth_;
      } else {
        toast.error("Không tìm thấy URL chuyển hướng!");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error(error.response.data.message);
            break;
          case 500:
            toast.error("Lỗi máy chủ, vui lòng thử lại sau!");
            break;
          default:
            toast.error(error.response.data.message || "Có lỗi xảy ra!");
        }
      } else {
        toast.error("Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <ToastContainer />
      <h1 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">
        Đăng ký
      </h1>
      <div className="max-w-lg mx-auto p-8 shadow-lg border border-gray-200 rounded-md bg-white">
        <h2 className="text-lg font-medium mb-6 text-center">Thông tin</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className="mb-6">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border rounded px-4 py-3 shadow-md"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-4 py-3 shadow-md"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full border rounded px-4 py-3 shadow-md"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            aria-label="Register"
            disabled={loading}
            className={`w-full py-3 rounded text-sm font-medium shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
          </button>
        </form>
        <div className="mt-8">
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
      </div>
    </div>
  );
};

export default Register;
