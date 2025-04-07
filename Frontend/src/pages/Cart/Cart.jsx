import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Cart() {
  // Use the cart context instead of local state
  const { cartItems, updateQuantity, getTotalPrice } = useCart();

  // Calculate total price from context
  const total = getTotalPrice();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between space-x-8">
        <div className="w-3/5">
          <h1 className="text-2xl font-bold mb-8 text-center">Giỏ hàng</h1>
          <hr className="mb-10" />
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
                <Link to="/products" className="text-blue-600 hover:underline">
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              cartItems.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={`${product.name}`}
                      className="w-32 h-32 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-gray-700">
                        Giá: {product.price.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      className="form-input border w-16 text-center"
                      value={product.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          product.id,
                          Math.max(0, parseInt(e.target.value))
                        )
                      }
                    />
                    <span>x</span>
                    <span className="text-gray-800 font-semibold">
                      {(product.price * product.quantity).toLocaleString()}₫
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
            <Link to="/products" className="block w-full py-3 mt-4 border border-gray-400 text-gray-600 text-lg text-center">
              TIẾP TỤC MUA HÀNG
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
