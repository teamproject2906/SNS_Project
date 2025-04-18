import { Link } from "react-router-dom";
import { useFavourite } from "../../context/FavouriteContext";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

function Favourite() {
  // Use the favourite context
  const { favouriteItems, removeFromFavourites, loading, error, fetchWishlist, getPriceAfterPromotion } = useFavourite();
  
  // Use the user context
  const { user } = useUser();

  // State for confirmation popup
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Fetch wishlist data when component mounts
  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle remove click
  const handleRemoveClick = (productId) => {
    setSelectedProductId(productId);
    setShowConfirmation(true);
  };

  // Handle confirm remove
  const handleConfirmRemove = () => {
    if (selectedProductId) {
      removeFromFavourites(selectedProductId);
    }
    setShowConfirmation(false);
    setSelectedProductId(null);
  };

  // Handle cancel remove
  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setSelectedProductId(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl">Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-xl text-red-500">Có lỗi xảy ra: {error}</p>
        <button 
          onClick={fetchWishlist} 
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
        <p className="text-xl text-gray-500 mb-4">Vui lòng đăng nhập để xem danh sách yêu thích</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
    {/* Confirmation Popup */}
    {showConfirmation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancelRemove}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmRemove}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Danh sách yêu thích</h1>
      <hr className="mb-10" />
      <div className="space-y-6">
        {favouriteItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500 mb-4">Danh sách yêu thích của bạn đang trống</p>
            <Link to="/products" className="text-blue-600 hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          favouriteItems.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border-b pb-6"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageUrl}
                  alt={`${product.productName}`}
                  className="w-32 h-32 object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{product.productName}</h3>
                  
                  {/* Display price after promotion */}
                  {product.promotion && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-500 line-through">
                        {product.price.toLocaleString()}₫
                      </span>
                      <span className="text-red-600 font-semibold">
                        {getPriceAfterPromotion(product).toLocaleString()}₫
                      </span>
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                        -{product.promotion.discount * 100}%
                      </span>
                    </div>
                  )}
                  
                  {!product.promotion && (
                    <p className="text-gray-700">
                      Giá: {product.price.toLocaleString()}₫
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Link
                  to={`/products/${product.id}`}
                  state={{ productCode: product.productCode }}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  Xem chi tiết sản phẩm
                </Link>
                <button
                  onClick={() => handleRemoveClick(product.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
  );
}

export default Favourite; 