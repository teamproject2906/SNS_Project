import { useEffect, useState } from "react";
import SideBar from "../../components/DashBoard/SideBar";
import UserTable from "../../components/DashBoard/UserTable";
import ProductTable from "../../components/DashBoard/ProductTable";
import OrderTable from "../../components/DashBoard/OrderTable";
import CategoryList from "../../components/DashBoard/CategoryList";

const DashBoardPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "users";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex">
      <SideBar activeTab={activeTab} handleTabChange={handleTabChange} />
      <div className="p-6 w-4/5">
        <h2 className="text-xl font-bold">Dashboard</h2>
        {activeTab === "users" && <UserTable />}
        {activeTab === "products" && <ProductTable />}
        {activeTab === "orders" && <OrderTable />}
        {activeTab === "category" && <CategoryList />}
      </div>
    </div>
  );
};

export default DashBoardPage;
