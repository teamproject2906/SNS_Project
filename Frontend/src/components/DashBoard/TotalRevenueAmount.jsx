import { useEffect, useState } from "react";
import { FaBoxes } from "react-icons/fa";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";

const TotalRevenueAmount = () => {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [orderAccepted, setOrderAccepted] = useState(null);

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fetchOrder = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/v1/order-details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filterOrderAccept = res.data.filter(
        (item) => item.orderStatus === "ACCEPTED"
      )
      setOrderAccepted(filterOrderAccept);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="layout_container bg-gradient-to-r from-purple-400 to-green-500 p-4 rounded-md">
      <div className="layout_flex flex flex-row items-center justify-between">
        <div className="layout_content_left flex flex-col">
          <div className="layout_content_number text-white text-3xl">
            {/* {formatNumber(product?.length)} */}
            {product?.length ? formatNumber(product.length) : 0}
          </div>
          <div className="layout_content_title text-white text-lg">
            Total Products
          </div>
        </div>
        <div className="layout_content_right">
          <div className="layout_content_icon bg-white border rounded-full p-4">
            <FaBoxes className="text-green-400" size={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueAmount;
