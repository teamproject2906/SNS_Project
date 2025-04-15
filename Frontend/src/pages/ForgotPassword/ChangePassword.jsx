import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { setToken, setUserInfo } from "../Login/app/static";
import { useUser } from "../../context/UserContext";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setTokenState] = useState(
    localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "")
  );
  const { user, setUser } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === "" || confirmPassword === "") {
      setMessage("Vui lòng điền đầy đủ thông tin");
    } else if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu không khớp");
    } else {
      setMessage("Đổi mật khẩu thành công!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  };

  useEffect(() => {
    const resetPassswordCookie = getCookie("emailToken")
    console.log("Token verify email từ cookie:", resetPassswordCookie);

    // Handle emailToken (email verification token)
    if (resetPassswordCookie) {
      const verifyEmail = async () => {
        try {
          const res = await axios.get(
            "http://localhost:8080/Authentication/register/verify",
            {
              params: { token: resetPassswordCookie }, // Pass token as query parameter
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true, // Thêm dòng này nếu backend có session hoặc JWT
            }
          );
          console.log("Email verification response:", res.data);
          const token = res.data.access_token;
          console.log("Token:", token);
          // Optionally clear the emailToken cookie after successful verification
          // setToken(token);
          // setTokenState(token);
          // const decoded = jwtDecode(token);
          // setUser(decoded);
          // setUserInfo(decoded);
          // document.cookie =
          //   "emailToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } catch (error) {
          console.error(
            "Error verifying email:",
            error.response ? error.response.data : error.message
          );
        }
      };
      verifyEmail();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Change Password
        </h2>

        <div className="space-y-6">
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
