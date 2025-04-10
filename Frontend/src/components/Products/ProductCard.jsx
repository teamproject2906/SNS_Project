import { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ products, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Đảm bảo products là mảng, nếu không thì gán mảng rỗng
  const safeProducts = Array.isArray(products) ? products : [];

  // Calculate pagination
  const totalPages = Math.ceil(safeProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = safeProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  return (
    <div className="container mx-auto">
      {safeProducts.length === 0 ? (
        <p style={{ textAlign: "center" }}>Hiện chưa có sản phẩm.</p>
      ) : (
        <>
          <div className="product-card grid grid-cols-4 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="product-card__item border rounded-lg p-4 flex flex-col justify-between gap-5 shadow-xl"
              >
                <Link
                  to={`/products/${item.id}`}
                  className="flex justify-center"
                >
                  <img
                    className="product-card__image"
                    src={
                      item.imageUrl ||
                      "https://media.istockphoto.com/id/1206425636/vector/image-photo-icon.jpg?s=612x612&w=0&k=20&c=zhxbQ98vHs6Xnvnnw4l6Nh9n6VgXLA0mvW58krh-laI="
                    }
                    alt={item.productName}
                    width={300}
                    height={300}
                  />
                </Link>
                <div className="flex flex-col gap-3">
                  <div className="product-card__info">
                    <h3
                      className="product-card__name pb-2 text-md"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "95%",
                      }}
                    >
                      {item.productName}
                    </h3>
                    <div className="flex flex-row gap-2 items-center">
                      {item.promotion ? (
                        <p className="product-card__discount-price text-base text-[#021f58] font-extrabold">
                          {formatPrice(
                            item.price - item.price * item.promotion.discount
                          )}
                          đ
                        </p>
                      ) : (
                        <p className="product-card__original-price text-base text-[#021f58] font-extrabold">
                          {formatPrice(item.price)}đ
                        </p>
                      )}
                      {item.promotion ? (
                        <p
                          className="product-card__original-price text-md text-gray-400"
                          style={{ textDecoration: "line-through" }}
                        >
                          {formatPrice(item.price)}đ
                        </p>
                      ) : (
                        ""
                      )}
                      {item.promotion ? (
                        <p className="product-card__promotion bg-red-500 p-1 text-sm w-12 flex justify-center rounded-md font-bold text-white">
                          -{formatPrice(item.promotion.discount * 100)}%
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="product-card__actions flex flex-row gap-2">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded w-full">
                      Add to cart
                    </button>
                    <button className="favoriteBtn">
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
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination flex justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`py-2 px-4 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductCard;