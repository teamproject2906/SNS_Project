import { useMemo, useState } from "react";
import Tabs from "../../components/Orders/Tabs";
import { OrderStatus } from "../../constants/DataConstant";
import { Truck } from "lucide-react";
const Order = () => {
  const [activeTab, setActiveTab] = useState("all");

  const title = useMemo(() => {
    return activeTab === "all"
      ? "Trạng thái đơn hàng"
      : tabs.find((tab) => tab.id === activeTab)?.label;
  }, [activeTab]);

  return (
    <div className="w-full h-full p-4 pt-5">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full h-full flex flex-col space-y-2">
        <div className="w-full h-full mt-4 bg-white p-5">
          <div className="flex flex-row space-x-2 border-b-2 border-gray-200 pb-2 text-sm">
            <Truck className="w-5 h-5" />
            <h3>{title}</h3>
          </div>
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col">
              <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                <img
                  src={
                    "https://dosi-in.com/file/detailed/384/dosiin-aothunsdvn-ao-thun-unisex-nam-nu-sdvn-photo-384774384774.jpg?w=670&h=670&fit=fill&fm=webp"
                  }
                  alt="order"
                  className="w-20 h-20 border-2 border-gray-200"
                />
                <div className="flex flex-col flex-1 h-full">
                  <h3>Tên sản phẩm: Áo thun đồ sơn</h3>
                  <p className="text-sm text-gray-500">Size: L</p>
                  <p className="text-sm">Đen trơn</p>
                </div>
                <p className="text-sm">Số lượng x 1</p>
              </div>
              <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                <img
                  src={
                    "https://dosi-in.com/file/detailed/384/dosiin-aothunsdvn-ao-thun-unisex-nam-nu-sdvn-photo-384774384774.jpg?w=670&h=670&fit=fill&fm=webp"
                  }
                  alt="order"
                  className="w-20 h-20 border-2 border-gray-200"
                />
                <div className="flex flex-col flex-1 h-full">
                  <h3>Tên sản phẩm: Áo thun đồ sơn</h3>
                  <p className="text-sm text-gray-500">Size: L</p>
                  <p className="text-sm">Đen trơn</p>
                </div>
                <p className="text-sm">Số lượng x 1</p>
              </div>
              <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                <img
                  src={
                    "https://dosi-in.com/file/detailed/384/dosiin-aothunsdvn-ao-thun-unisex-nam-nu-sdvn-photo-384774384774.jpg?w=670&h=670&fit=fill&fm=webp"
                  }
                  alt="order"
                  className="w-20 h-20 border-2 border-gray-200"
                />
                <div className="flex flex-col flex-1 h-full">
                  <h3>Tên sản phẩm: Áo thun đồ sơn</h3>
                  <p className="text-sm text-gray-500">Size: L</p>
                  <p className="text-sm">Đen trơn</p>
                </div>
                <p className="text-sm">Số lượng x 1</p>
              </div>
              <div className="flex flex-row justify-end pt-5 items-center">
                <p className="text-sm">
                  Thanh toán:{" "}
                  <span className="font-medium text-2xl">100.000 đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full mt-4 bg-white p-5">
          <div className="flex flex-row space-x-2 border-b-2 border-gray-200 pb-2 text-sm">
            <Truck className="w-5 h-5" />
            <h3>{title}</h3>
          </div>
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col">
              <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                <img
                  src={
                    "https://dosi-in.com/file/detailed/384/dosiin-aothunsdvn-ao-thun-unisex-nam-nu-sdvn-photo-384774384774.jpg?w=670&h=670&fit=fill&fm=webp"
                  }
                  alt="order"
                  className="w-20 h-20 border-2 border-gray-200"
                />
                <div className="flex flex-col flex-1 h-full">
                  <h3>Tên sản phẩm: Áo thun đồ sơn</h3>
                  <p className="text-sm text-gray-500">Size: L</p>
                  <p className="text-sm">Đen trơn</p>
                </div>
                <p className="text-sm">Số lượng x 1</p>
              </div>
              <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                <img
                  src={
                    "https://dosi-in.com/file/detailed/384/dosiin-aothunsdvn-ao-thun-unisex-nam-nu-sdvn-photo-384774384774.jpg?w=670&h=670&fit=fill&fm=webp"
                  }
                  alt="order"
                  className="w-20 h-20 border-2 border-gray-200"
                />
                <div className="flex flex-col flex-1 h-full">
                  <h3>Tên sản phẩm: Áo thun đồ sơn</h3>
                  <p className="text-sm text-gray-500">Size: L</p>
                  <p className="text-sm">Đen trơn</p>
                </div>
                <p className="text-sm">Số lượng x 1</p>
              </div>
              <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                <img
                  src={
                    "https://dosi-in.com/file/detailed/384/dosiin-aothunsdvn-ao-thun-unisex-nam-nu-sdvn-photo-384774384774.jpg?w=670&h=670&fit=fill&fm=webp"
                  }
                  alt="order"
                  className="w-20 h-20 border-2 border-gray-200"
                />
                <div className="flex flex-col flex-1 h-full">
                  <h3>Tên sản phẩm: Áo thun đồ sơn</h3>
                  <p className="text-sm text-gray-500">Size: L</p>
                  <p className="text-sm">Đen trơn</p>
                </div>
                <p className="text-sm">Số lượng x 1</p>
              </div>
              <div className="flex flex-row justify-end pt-5 items-center">
                <p className="text-sm">
                  Thanh toán:{" "}
                  <span className="font-medium text-2xl">100.000 đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

const tabs = [
  {
    id: "all",
    label: "Tất cả",
  },
  {
    id: OrderStatus.PENDING,
    label: "Chờ xác nhận",
  },
  {
    id: OrderStatus.APPROVED,
    label: "Đã xác nhận",
  },
  {
    id: OrderStatus.REJECTED,
    label: "Đã từ chối",
  },
  {
    id: OrderStatus.DELIVERING,
    label: "Đang giao hàng",
  },
  {
    id: OrderStatus.COMPLETED,
    label: "Đã hoàn thành",
  },
  {
    id: OrderStatus.CANCELED,
    label: "Đã hủy",
  },
];
