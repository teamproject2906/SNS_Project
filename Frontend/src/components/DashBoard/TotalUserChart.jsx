import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";

const TotalUserChart = () => {
  const [user, setUser] = useState(null);

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/User/getAllUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = res.data.filter((user) => user.role !== "ADMIN");
      setUser(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="layout_container bg-gradient-to-r from-red-400 to-blue-500 p-4 rounded-md">
      <div className="layout_flex flex flex-row items-center justify-between">
        <div className="layout_content_left flex flex-col">
          <div className="layout_content_number text-white text-3xl">
            {/* {formatNumber(user?.length)} */}
            {user?.length ? formatNumber(user.length) : "0"}
          </div>
          <div className="layout_content_title text-white text-lg">
            Total Users
          </div>
        </div>
        <div className="layout_content_right">
          <div className="layout_content_icon bg-white border rounded-full p-4">
            <FaUsers className="text-blue-400" size={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalUserChart;
