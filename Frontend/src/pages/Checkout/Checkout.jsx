import { useSearchParams } from "react-router-dom";
import CheckoutForm from "../../components/Checkout/CheckoutForm/CheckoutForm";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary/CheckoutSummary";
import { useEffect, useRef } from "react";
import { getToken } from "../Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";

function Checkout() {
  const [searchParams] = useSearchParams();

  const payment = searchParams.get("payment");
  const orderCreatedRef = useRef(false);

  const handleCreateOrder = async (payload) => {
    try {
      const response = await createOrder(payload);
      toast.success("Đơn hàng đã được tạo thành công");
      return response.data;
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng");
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (orderCreatedRef.current) return;
    const checkoutStr = localStorage.getItem("checkout");
    if (payment === "success" && checkoutStr && !orderCreatedRef.current) {
      const checkout = JSON.parse(checkoutStr);
      const fetchCart = async () => {
        try {
          const token = getToken();
          const response = await axios.get(
            `http://localhost:8080/api/v1/cart/${checkout.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.data && response.data.items) {
            const responseData = response.data;
            const payload = {
              userId: responseData.userId,
              orderItems: responseData.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                color: item?.product?.color,
                size: item?.product?.sizeChart?.value,
                imageUrl: item?.imageUrl,
              })),
              totalAmount: checkout.totalAmount,
              voucherId: checkout?.voucher?.id,
              address: {
                id: checkout?.address?.id,
              },
              orderDate: new Date().toISOString(),
              shippingDate: new Date(
                new Date().getTime() + 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              orderStatus: "PENDING",
              paymentMethod: "CREDIT",
            };
            orderCreatedRef.current = true;
            await handleCreateOrder(payload);
            localStorage.removeItem("checkout");
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
          toast.error("Không thể tải giỏ hàng");
        }
      };
      fetchCart();
    }
  }, [payment]);

  if (payment === "success") {
    return (
      <div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto px-6 md:px-12 lg:px-16 py-10 gap-28">
        <div className="w-full lg:w-[48%]">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-green-600">
              Đơn hàng đã được tạo thành công
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto px-6 md:px-12 lg:px-16 py-10 gap-28">
      {/* Form giao hàng */}
      <div className="w-full lg:w-[48%]">
        <CheckoutForm />
      </div>
      {/* Tóm tắt đơn hàng */}
      <div className="w-full lg:w-[48%]">
        <CheckoutSummary />
      </div>
    </div>
  );
}

export default Checkout;
