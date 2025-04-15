import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Thêm dòng này nếu backend có session hoặc JWT
        }
      );
      console.log("Response:", res.data);
      toast.success(res.data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";

      toast.error(errorMessage); // Show error toast
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
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
