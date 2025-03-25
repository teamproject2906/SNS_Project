import { CiUser } from "react-icons/ci";
import { MdShoppingCart, MdProductionQuantityLimits } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TbNumber } from "react-icons/tb";
import { BsAlphabetUppercase } from "react-icons/bs";

const SideBar = ({ activeTab, handleTabChange }) => {
  return (
    <div className="w-1/5 p-4 bg-white min-h-screen shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-purple-600">Navigation</h3>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "users" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("users")}
      >
        <CiUser className="mr-2" /> Users
      </button>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "products" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("products")}
      >
        <MdProductionQuantityLimits className="mr-2" /> Products
      </button>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "orders" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("orders")}
      >
        <MdShoppingCart className="mr-2" /> Orders
      </button>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "category" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("category")}
      >
        <BiCategory className="mr-2" /> Category List
      </button>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "size" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("size")}
      >
        <MdShoppingCart className="mr-2" /> Size Chart
      </button>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "alphabet" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("alphabet")}
      >
        <BsAlphabetUppercase className="mr-2" /> Alphabet Chart
      </button>
      <button
        className={`w-full mb-2 flex items-center p-4 rounded-lg transition duration-200 ${
          activeTab === "numeric" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
        }`}
        onClick={() => handleTabChange("numeric")}
      >
        <TbNumber className="mr-2" /> Numeric Chart
      </button>
    </div>
  );
};

export default SideBar;
