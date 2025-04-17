import { CiUser } from "react-icons/ci";
import { MdShoppingCart, MdProductionQuantityLimits } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import {
  getUserInfo,
  removeToken,
  removeUserInfo,
} from "../../pages/Login/app/static";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../../context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";
const token = localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "");

const SideBar = ({ activeTab, handleTabChange }) => {
  const navigate = useNavigate();
  // const { setUser } = useUser(); // Lấy setUser từ UserContext
  const [user, setUser] = useState({
    avatar: "",
    username: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = getUserInfo();
  console.log("User Info:", user);

  const handleLogout = () => {
    removeToken();
    removeUserInfo();
    localStorage.removeItem("user"); // Xóa user khỏi localStorage
    setUser(null); // Xóa user trong context
    navigate("/");
  };

  // Lấy thông tin từ JWT token để xác định user
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  // Lấy thông tin user từ backend khi component mount
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

        // Xử lý response và cập nhật state
        const userData = response.data;

        setUser({
          ...userData,
          // Đảm bảo các trường khác có giá trị mặc định nếu API không trả về
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
  }, [token]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-white">
  //       <p className="text-xl">Đang tải thông tin...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-white">
  //       <p className="text-xl text-red-600">{error}</p>
  //     </div>
  //   );
  // }

  return (
    <div className="w-1/5 p-4 bg-white min-h-screen shadow-lg flex flex-col justify-between">
      <header className="">
        <h3 className="text-lg font-bold mb-4 text-purple-600">Dashboard</h3>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "users"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("users")}
        >
          <CiUser className="mr-2" /> Users
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "products"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("products")}
        >
          <MdProductionQuantityLimits className="mr-2" /> Products
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "category"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("category")}
        >
          <BiCategory className="mr-2" /> Category List
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "size"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("size")}
        >
          <MdShoppingCart className="mr-2" /> Size Chart
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "promotion"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("promotion")}
        >
          <BiCategory className="mr-2" /> Promotion
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "voucher"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("voucher")}
        >
          <BiCategory className="mr-2" /> Voucher
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "orders"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("orders")}
        >
          <MdShoppingCart className="mr-2" /> Orders
        </button>

        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "formClothes"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("formClothes")}
        >
          <BiCategory className="mr-2" /> Form Clothes
        </button>

        {/* <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "alphabet"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("alphabet")}
        >
          <BsAlphabetUppercase className="mr-2" /> Alphabet Chart
        </button>
        <button
          className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
            activeTab === "numeric"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("numeric")}
        >
          <TbNumber className="mr-2" /> Numeric Chart
        </button> */}
      </header>
      <footer className="">
        <div className="layoutProfile bg-purple-600 text-white p-4 rounded-lg">
          <div className="contentLeft flex items-center flex-row justify-between">
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />

              <div className="ml-2">
                <p className="font-bold">{userInfo.sub}</p>
                <p className="text-sm">{user.role}</p>
              </div>
            </div>
            <div className="contentRight flex items-center flex-col">
              <button className="text-white px-2 py-1 rounded-lg">
                <IoSettingsOutline />
              </button>
              <button
                className="text-white px-2 py-1 rounded-lg"
                onClick={handleLogout}
              >
                <IoLogOutOutline />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SideBar;
