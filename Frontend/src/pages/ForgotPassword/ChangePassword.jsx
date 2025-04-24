import axios from "axios";
import { useState } from "react";
import { getToken, removeToken, removeUserInfo } from "../Login/app/static";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  console.log("New Password:", newPassword);
  console.log("Confirm Password:", confirmPassword);

  // useEffect(() => {
  //   try {
  //     const res = axios.get(
  //       "http://localhost:8080/Authentication/register/verify",
  //       {
  //         params: { token: tokenTemp },
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include", // Thêm dòng này nếu backend có session hoặc JWT
  //       }
  //     );
  //     res.then((data) => setToken(data.data.access_token));
  //     localStorage.removeItem("tokenTemp");
  //     const token = getToken();
  //     console.log("Token fetched:", token);
  //     console.log(res.then((data) => console.log("Data:", data)));
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error when get response", error);
  //   }
  // }, [tokenTemp]);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:8080/Authentication/changeForgotPassword",
        {
          email: email,
          otp: otp,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Change password successfully");
    } catch (error) {
      toast.error(error.response?.data.details || "Something went wrong");
    } finally {
      navigate("/login")
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Change Password
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="OTP Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center ${
                message.includes("Successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
