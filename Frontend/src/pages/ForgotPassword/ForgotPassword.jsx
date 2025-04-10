import { useState } from "react";

export default function ForgotPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
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
