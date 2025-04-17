import { useEffect, useState } from "react";
import SideBar from "../../components/DashBoard/SideBar";
import UserTable from "../../components/DashBoard/UserTable";
import ProductTable from "../../components/DashBoard/ProductTable";
import OrderTable from "../../components/DashBoard/OrderTable";
import CategoryList from "../../components/DashBoard/CategoryList";
import SizeChart from "../../components/DashBoard/SizeChart";
import FormClothesChart from "../../components/DashBoard/FormClothesChart";
import PromotionChart from "../../components/DashBoard/PromotionChart.";
import VoucherTable from "../../components/DashBoard/VoucherTable";

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
        {activeTab === "users" && <UserTable />}
        {activeTab === "products" && <ProductTable />}
        {activeTab === "orders" && <OrderTable />}
        {activeTab === "category" && <CategoryList />}
        {activeTab === "size" && <SizeChart />}
        {/* {activeTab === "alphabet" && <AlphabetChart />}
        {activeTab === "numeric" && <NumericChart />} */}
        {activeTab === "formClothes" && <FormClothesChart />}
        {activeTab === "promotion" && <PromotionChart />}
        {activeTab === "voucher" && <VoucherTable />}
      </div>
    </div>
  );
};

export default DashBoardPage;
