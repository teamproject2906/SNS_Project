import { useEffect, useState } from "react";
import SideBar from "../../components/DashBoard/SideBar";
import UserTable from "../../components/DashBoard/UserTable";
import ProductTable from "../../components/DashBoard/ProductTable";
import OrderTable from "../../components/DashBoard/OrderTable";
import CategoryList from "../../components/DashBoard/CategoryList";
import SizeChart from "../../components/DashBoard/SizeChart";
import FormClothesChart from "../../components/DashBoard/FormClothesChart";

import VoucherTable from "../../components/DashBoard/VoucherTable";
import ChartData from "../../components/DashBoard/ChartData";
import PromotionChart from "../../components/DashBoard/PromotionChart.";
import PostSocial from "../../components/DashBoard/PostSocial";

const DashBoardPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("activeTab") || "users";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Trạng thái sidebar

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <SideBar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`p-6 transition-all duration-300 ${
          isSidebarOpen ? "w-4/5" : "w-full"
        }`}
      >
        {activeTab === "users" && <UserTable />}
        {activeTab === "products" && <ProductTable />}
        {activeTab === "orders" && <OrderTable />}
        {activeTab === "category" && <CategoryList />}
        {activeTab === "size" && <SizeChart />}
        {activeTab === "formClothes" && <FormClothesChart />}
        {activeTab === "promotion" && <PromotionChart />}
        {activeTab === "voucher" && <VoucherTable />}
        {activeTab === "chart" && <ChartData />}
        {activeTab === "socialPost" && <PostSocial />}
      </div>
    </div>
  );
};

export default DashBoardPage;