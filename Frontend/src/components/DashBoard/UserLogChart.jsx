import axios from "axios";
import { getToken } from "../../pages/Login/app/static";
import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const UserLogChart = () => {
  const [userLog, setUserLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const logsPerPage = 5; // Số lượng hàng tối đa trên mỗi trang

  const fetchUserLog = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const res = await axios.get("http://localhost:8080/User/getUserLog", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserLog(res.data);
      console.log("User Log:", res.data);
    } catch (error) {
      console.error("Error fetching user log:", error);
      setError("Failed to load user logs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLog();
  }, []);

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalPages = Math.ceil(userLog.length / logsPerPage); // Tổng số trang
  const startIndex = (currentPage - 1) * logsPerPage; // Chỉ số bắt đầu
  const endIndex = startIndex + logsPerPage; // Chỉ số kết thúc
  const currentLogs = userLog.slice(startIndex, endIndex); // Dữ liệu trên trang hiện tại

  const parseDateForInput = (dateString) => {
    if (!dateString) return "";

    // Handle both YYYY-MM-DD and YYYY-MM-DDTHH:mm:ss formats
    const simpleDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (simpleDateRegex.test(dateString)) {
      return dateString; // Already in YYYY-MM-DD
    }

    // Extract YYYY-MM-DD from YYYY-MM-DDTHH:mm:ss
    if (dateString.includes("T")) {
      return dateString.split("T")[0]; // Get the date part
    }

    return ""; // Invalid format
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Get YYYY-MM-DD part
    const yyyymmdd = parseDateForInput(dateString);
    if (!yyyymmdd) return "";

    // Convert YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = yyyymmdd.split("-");
    return `${day}/${month}/${year}`;
  };

  // Xử lý chuyển trang
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="text-wrap overflow-hidden ellipsis max-h-svh">
      {/* Thông báo lỗi */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-pink-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody className="divide-y divide-gray-200">
                {/* Hiển thị skeleton loading khi đang tải dữ liệu */}
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : userLog.length === 0 ? (
              <tbody className="divide-y divide-gray-200">
                {/* Hiển thị thông báo khi không có dữ liệu */}
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No user logs found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-200">
                {/* Dữ liệu user log trên trang hiện tại */}
                {currentLogs.map((log) => (
                  <tr
                    key={log.username}
                    className="hover:bg-pink-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {log.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {log.actionType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(log.actionTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Phân trang */}
        {!loading && userLog.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            {/* Thông tin số trang */}
            <div className="text-sm text-gray-600">
              Showing {" "}
              {endIndex > userLog.length ? userLog.length : endIndex} of{" "}
              {userLog.length} entries
            </div>

            {/* Nút phân trang */}
            <div className="flex items-center gap-2">
              {/* Nút Previous */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-pink-600 hover:bg-pink-100"
                } transition-colors duration-200`}
              >
                <FaChevronLeft />
              </button>

              {/* Số trang */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? "bg-pink-500 text-white"
                        : "text-gray-600 hover:bg-pink-100"
                    } transition-colors duration-200`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Nút Next */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-pink-600 hover:bg-pink-100"
                } transition-colors duration-200`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogChart;
