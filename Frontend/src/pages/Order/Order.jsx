import { Fragment, useEffect, useMemo } from "react";
import Tabs from "../../components/Orders/Tabs";
import { OrderStatus } from "../../constants/DataConstant";
import { Truck } from "lucide-react";
import useOrders from "../../hooks/useOrders";
import { useUser } from "../../context/UserContext";
const Order = () => {
  const { user } = useUser();
  const { orders, loading, error, orderStatus, setOrderStatus, setUserId } =
    useOrders();

  const title = useMemo(() => {
    return tabs.find((tab) => tab.id === orderStatus)?.label;
  }, [orderStatus]);

  useEffect(() => {
    if (user?.id) {
      setUserId(user?.id);
    }
  }, [setUserId, user?.id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full h-full p-4 pt-5">
      <Tabs tabs={tabs} activeTab={orderStatus} setActiveTab={setOrderStatus} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full h-full flex flex-col space-y-2">
          {orders.map((order) => (
            <Fragment key={order.id}>
              <div className="w-full h-full mt-4 bg-white p-5">
                <div className="flex flex-row space-x-2 border-b-2 border-gray-200 pb-2 text-sm">
                  <Truck className="w-5 h-5" />
                  <h3>{title}</h3>
                </div>
                <div className="w-full h-full flex flex-col">
                  <div className="flex flex-col">
                    {order?.orderItems.map((item) => (
                      <Fragment key={item.id}>
                        <div className="flex flex-row py-3 border-b-2 border-gray-200 space-x-4 items-center">
                          <div className="flex flex-col flex-1 h-full">
                            <h3>Tên sản phẩm: {item.productName}</h3>
                            <p className="text-sm text-gray-500">
                              Kích cỡ: {item.size}
                            </p>
                            <p className="text-sm">Màu: {item.color}</p>
                          </div>
                          <p className="text-sm">Số lượng x {item.quantity}</p>
                        </div>
                      </Fragment>
                    ))}

                    <div className="flex flex-row justify-end pt-5 items-center">
                      <p className="text-sm">
                        Thanh toán:{" "}
                        <span className="font-medium text-2xl">
                          {/* TODO: format number to VN currency */}
                          {order?.totalAmount?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;

const tabs = [
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
