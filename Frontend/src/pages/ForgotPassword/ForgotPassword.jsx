import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Client-side validation
    if (email === "") {
      toast.error("Please enter an email");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true); // Show loading state

    try {
      const res = await axios.post(
        `http://localhost:8080/Authentication/ForgotPassword/${email}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ phải đặt ở object thứ 3
        }
      
      );

      // localStorage.setItem("tokenTemp", res.data.refresh_token);
      console.log("Response:", res);
      toast.success(res.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data); // Show error toast
    } finally {
      setIsLoading(false); // Reset loading state
      navigate("/change-forgot-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoading} // Disable input during loading
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white transition duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
}
