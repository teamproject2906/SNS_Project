import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function Cart() {
  // Use the cart context instead of local state
  const [searchParams] = useSearchParams();
  const payment = searchParams.get("payment");

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    loading,
    error,
    fetchCart,
    getPriceAfterPromotion,
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
    try {
      await updateQuantity(itemId, newQuantity);
      // Fetch fresh cart data after update
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      // Fetch fresh cart data after removal
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    if (payment === "failure") {
      toast.error("Payment failed!");
    }
  }, [payment]);

  // Calculate total price from context
  const total = getTotalPrice();

  // if (loading || isUpdating) {
  //   return (
  //     <div className="container mx-auto px-6 py-8 text-center">
  //       <p className="text-xl">Đang tải giỏ hàng...</p>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button
          onClick={fetchCart}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl text-gray-500 mb-4">
          Please log in to access your cart.
        </p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between space-x-8">
        <div className="w-3/5">
          <h1 className="text-2xl font-bold mb-8 text-center">Cart</h1>
          <hr className="mb-10" />
          {loading ? (
            <div className="container mx-auto px-6 py-8 text-center">
              <p className="text-xl">Loading...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xl text-gray-500 mb-4">
                    Cart is empty
                  </p>
                  <Link
                    to="/products"
                    className="text-blue-600 hover:underline"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl}
                        alt={`${item.product.productName}`}
                        className="w-32 h-32 object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.product.productName}
                        </h3>

                        {/* Display color information */}
                        <p className="text-gray-600">
                          Color: {item.product.color}
                        </p>

                        {/* Display size information */}
                        <p className="text-gray-600">
                          Size: {item.product.sizeChart.value}
                        </p>

                        {/* Display price after promotion */}
                        {item.product.promotion && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-gray-500 line-through">
                              {item.unitPrice.toLocaleString()}₫
                            </span>
                            <span className="text-red-600 font-semibold">
                              {getPriceAfterPromotion(item).toLocaleString()}₫
                            </span>
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                              -{item.product.promotion.discount * 100}%
                            </span>
                          </div>
                        )}

                        {!item.product.promotion && (
                          <p className="text-gray-700 mt-1">
                            {item.unitPrice.toLocaleString()}₫
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="form-input border w-16 text-center"
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            handleQuantityUpdate(
                              item.id,
                              Math.max(1, parseInt(e.target.value || 1))
                            )
                          }
                        />
                        <span>x</span>
                        <span className="text-gray-800 font-semibold">
                          {getPriceAfterPromotion(item).toLocaleString()}₫
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Xóa sản phẩm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <p className="text-gray-600 text-right">
                        Total:{" "}
                        {(
                          getPriceAfterPromotion(item) * item.quantity
                        ).toLocaleString()}
                        ₫
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="w-2/5 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Information</h2>
          <div className="mb-6">
            <p className="text-gray-600">Estimated total cost</p>
            <p className="text-xl font-semibold">{total.toLocaleString()}₫</p>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Not including shipping</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Total cost</p>
            <p className="text-2xl font-bold">{total.toLocaleString()}₫</p>
          </div>
          <div className="mt-8 w-full">
            <Link
              to={`/checkout`}
              onClick={(e) => {
                if (cartItems.length === 0) {
                  e.preventDefault(); // chặn chuyển trang
                }
              }}
              className={`block w-full py-3 bg-black text-white text-lg font-semibold text-center ${
                cartItems.length === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              CHECK OUT
            </Link>
            <Link
              to="/products"
              className="block w-full py-3 mt-4 border border-gray-400 text-gray-600 text-lg text-center"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
