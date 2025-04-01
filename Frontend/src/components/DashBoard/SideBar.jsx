import { CiUser } from "react-icons/ci";
import { MdShoppingCart, MdProductionQuantityLimits } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TbNumber } from "react-icons/tb";
import { BsAlphabetUppercase } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { getToken, getUserInfo, removeToken, removeUserInfo } from "../../pages/Login/app/static";
import { useNavigate } from "react-router-dom";

const SideBar = ({ activeTab, handleTabChange }) => {
  const navigate = useNavigate();

  const userInfo = getUserInfo();
  console.log("User Info:", userInfo);

  const handleLogout = () => {
      // Gọi các hàm để xóa token và user info
      removeToken();
      removeUserInfo();
  
      // Kiểm tra lại sau khi xóa
      console.log("Token sau khi xóa:", getToken());
      console.log("User sau khi xóa:", getUserInfo());
      navigate("/");
    };

  return (
    <div className="w-1/5 p-4 bg-white min-h-screen shadow-lg flex flex-col justify-between">
      <header className="">
        <h3 className="text-lg font-bold mb-4 text-purple-600">Navigation</h3>
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
            activeTab === "formClothes"
              ? "bg-purple-100 text-purple-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleTabChange("formClothes")}
        >
          <BiCategory className="mr-2" /> Form Clothes
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
        </button>
      </header>
      <footer className="">
        <div className="layoutProfile bg-purple-600 text-white p-4 rounded-lg">
          <div className="contentLeft flex items-center flex-row justify-between">
            <div className="flex items-center">
              <img
                src="https://i.pravatar.cc/150?img=68"
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />

              <div className="ml-2">
                <p className="font-bold">{userInfo.sub}</p>
                <p className="text-sm">Admin</p>
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
