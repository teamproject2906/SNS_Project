import CheckoutForm from "../../components/Checkout/CheckoutForm/CheckoutForm";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary/CheckoutSummary";

function Checkout() {
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
