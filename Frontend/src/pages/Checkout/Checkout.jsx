import { useNavigate, useSearchParams } from "react-router-dom";
import CheckoutForm from "../../components/Checkout/CheckoutForm/CheckoutForm";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary/CheckoutSummary";
import { useEffect, useRef, useState } from "react";
import { getToken } from "../Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";

function Checkout() {
  const [searchParams] = useSearchParams();

  const payment = searchParams.get("payment");
  const orderCreatedRef = useRef(false);
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

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

  useEffect(() => {
    if (payment !== "success") return;

    // Đếm ngược từ 10 đến 0, mỗi giây giảm 1
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(interval); // Dừng interval khi đếm về 0
          navigate("/"); // Điều hướng về trang chủ
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [navigate, payment]);

  if (payment === "success") {
    return (
      <div className="flex flex-col lg:flex-row justify-center items-start max-w-full mx-auto px-6 md:px-12 lg:px-16 py-10 gap-28">
        <div className="w-full lg:w-[48%]">
          <div className="flex flex-col items-center justify-center gap-10">
            <h1 className="text-2xl font-bold text-green-600">
              Order has been placed successfully!
            </h1>
            <div>
              Redirect to home after <span className="font-semibold">{count}</span> seconds
            </div>
            <div className="bg-green-600 text-white py-2 px-4 rounded">
              <button onClick={() => navigate("/")}>BACK TO HOME</button>
            </div>
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
