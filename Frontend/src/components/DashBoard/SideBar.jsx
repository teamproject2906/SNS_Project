import { FaUser } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { BiCategory, BiSolidDiscount } from "react-icons/bi";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { BsBoxSeamFill } from "react-icons/bs";
import { HiMenuAlt3 } from "react-icons/hi"; // Icon cho nút toggle
import { FaChartLine } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { BsPostcardHeartFill } from "react-icons/bs";
import {
  removeToken,
  removeUserInfo,
  setToken,
  setUserInfo,
} from "../../pages/Login/app/static";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const SideBar = ({
  activeTab,
  handleTabChange,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setTokenState] = useState(
    localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "")
  ); // Thêm state cho token

  const handleLogout = (notify) => {
    console.log("Before logout:", {
      token: localStorage.getItem("AUTH_TOKEN"),
      user: localStorage.getItem("USER_KEY"),
    });
    removeToken();
    removeUserInfo();
    localStorage.removeItem("USER_KEY");
    document.cookie =
      "id_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "emailTokenForGG=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    console.log("After logout:", {
      token: localStorage.getItem("AUTH_TOKEN"),
      user: localStorage.getItem("USER_KEY"),
    });
    toast.info(notify);
    navigate("/login");
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setError("Bạn chưa đăng nhập");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const decodedToken = parseJwt(token);
        const userId = decodedToken?.userId;

        if (!userId) {
          throw new Error("Không thể xác định thông tin người dùng");
        }

        const response = await axios.get(
          `http://localhost:8080/User/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const userData = response.data;
        setUser({
          ...userData,
          avatar:
            userData.avatar ||
            "https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png",
          username: userData.username || "",
          role: userData.role || "User",
        });
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Không thể lấy thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, setUser]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          toast.error("Your session has expired. Please log in again.");
          setTimeout(() => handleLogout(), 2000);
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 3000); // Kiểm tra mỗi 60 giây
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const cookieToken = getCookie("id_token");
    const storedToken = localStorage
      .getItem("AUTH_TOKEN")
      ?.replace(/^"|"$/g, "");
    const validToken = cookieToken || storedToken;

    if (validToken && !user) {
      try {
        setToken(validToken);
        setTokenState(validToken);
        const decoded = jwtDecode(validToken);
        setUser(decoded);
        setUserInfo(decoded);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        handleLogout();
      }
    }
  }, [user, setUser]);

  // Interceptor cho axios
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        setTimeout(() => handleLogout(), 2000);
      }
      return Promise.reject(error);
    }
  );

  return (
    <div
      className={`min-h-screen bg-white shadow-lg transition-all duration-300 flex flex-col justify-between ${
        isSidebarOpen ? "w-1/5" : "w-[8%]"
      }`}
    >
      <div>
        <div className="flex flex-row items-center justify-between p-4">
          {isSidebarOpen && (
            <h3 className="text-lg font-bold text-purple-600">Dashboard</h3>
          )}
          {/* Nút toggle */}
          <button
            className={`text-purple-600 ${
              isSidebarOpen ? "" : "w-full flex justify-center"
            }`}
            onClick={toggleSidebar}
          >
            <HiMenuAlt3 size={26} />
          </button>
        </div>
        {/* Footer */}
        <footer className="px-4 pb-4">
          <div className="bg-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center transition duration-200 ${
                  isSidebarOpen ? "" : "w-full flex justify-center p-1"
                }`}
              >
                <div className="w-10 h-10">
                  <img
                    src={
                      user?.avatar ||
                      "https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
                    }
                    alt={user?.username || "User"}
                    className={`w-full h-full 
                    
                    rounded-full border-2 border-white`}
                  />
                </div>
                {isSidebarOpen && (
                  <div className="ml-2">
                    <p className="font-bold">{user?.username || "Unknown"}</p>
                    <p className="text-sm">{user?.role || "User"}</p>
                  </div>
                )}
              </div>
              {isSidebarOpen && (
                <div className="flex items-center flex-col">
                  <button
                    className="text-white px-2 py-1 rounded-lg"
                    onClick={() => navigate(`/profile-page`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-white px-2 py-1 rounded-lg"
                    onClick={handleLogout}
                  >
                    <IoLogOutOutline size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </footer>
        {/* Header */}
        <header className="px-4 transition delay-50 duration-300 ease-in-out">
          {/* Menu items */}
          {[
            { tab: "chart", icon: <FaChartLine />, label: "Summary" },
            { tab: "users", icon: <FaUser />, label: "Users" },
            { tab: "products", icon: <BsBoxSeamFill />, label: "Products" },
            { tab: "category", icon: <BiCategory />, label: "Category List" },
            { tab: "size", icon: <FaRulerCombined />, label: "Size Chart" },
            { tab: "promotion", icon: <MdDiscount />, label: "Promotion" },
            { tab: "voucher", icon: <BiSolidDiscount />, label: "Voucher" },
            { tab: "orders", icon: <FaHistory />, label: "Orders" },
            { tab: "formClothes", icon: <GiClothes />, label: "Form Clothes" },
            { tab: "socialPost", icon: <BsPostcardHeartFill />, label: "Social Post" },
          ].map((item) => (
            <button
              key={item.tab}
              className={`w-full mb-2 flex items-center h-12 p-4 rounded-lg transition duration-300 ease-in-out
              ${isSidebarOpen ? "" : "justify-center"} 
              ${
                activeTab === item.tab
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange(item.tab)}
            >
              <span
                className={`text-lg items-center ${isSidebarOpen ? "" : ""}`}
              >
                {item.icon}
              </span>
              {isSidebarOpen && <span className="ml-2">{item.label}</span>}
            </button>
          ))}
        </header>
      </div>
    </div>
  );
};

export default SideBar;
