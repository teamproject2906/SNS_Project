import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";

function Cart() {
  // Use the cart context instead of local state
  const {
    cartItems,
    updateQuantity,
    getTotalPrice,
    loading,
    error,
    fetchCart,
  } = useCart();
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch cart data when component mounts
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this only runs once on mount

  // Handle quantity update with proper state management
  const handleQuantityUpdate = async (itemId, newQuantity) => {
    setIsUpdating(true);
    try {
      await updateQuantity(itemId, newQuantity);
      // Fetch fresh cart data after update
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate total price from context
  const total = getTotalPrice();

  if (loading || isUpdating) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl text-red-500">Có lỗi xảy ra: {error}</p>
        <button
          onClick={fetchCart}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl text-gray-500 mb-4">
          Vui lòng đăng nhập để xem giỏ hàng
        </p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between space-x-8">
        <div className="w-3/5">
          <h1 className="text-2xl font-bold mb-8 text-center">Giỏ hàng</h1>
          <hr className="mb-10" />
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-500 mb-4">
                  Giỏ hàng của bạn đang trống
                </p>
                <Link to="/products" className="text-blue-600 hover:underline">
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={`${item.productName}`}
                      className="w-32 h-32 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {item.productName}
                      </h3>
                      <p className="text-gray-700">
                        Giá: {(item.unitPrice * item.quantity).toLocaleString()}
                        ₫
                      </p>
                      {item.color && (
                        <p className="text-gray-600">Màu: {item.color}</p>
                      )}
                      {item.size && (
                        <p className="text-gray-600">Kích thước: {item.size}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      className="form-input border w-16 text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityUpdate(
                          item.id,
                          Math.max(0, parseInt(e.target.value || 0))
                        )
                      }
                    />
                    <span>x</span>
                    <span className="text-gray-800 font-semibold">
                      {item.unitPrice.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-2/5 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Thông tin</h2>
          <div className="mb-6">
            <p className="text-gray-600">Tạm tính</p>
            <p className="text-xl font-semibold">{total.toLocaleString()}₫</p>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Chưa bao gồm phí vận chuyển</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Tổng tiền</p>
            <p className="text-2xl font-bold">{total.toLocaleString()}₫</p>
          </div>
          <div className="mt-8 w-full">
            <Link
              to={`/checkout`}
              className="block w-full py-3 bg-black text-white text-lg font-semibold text-center"
            >
              THANH TOÁN
            </Link>
            <Link
              to="/products"
              className="block w-full py-3 mt-4 border border-gray-400 text-gray-600 text-lg text-center"
            >
              TIẾP TỤC MUA HÀNG
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;