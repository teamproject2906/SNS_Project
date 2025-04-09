import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../pages/Login/app/static";

const ProductCard = () => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
        console.log("Product", res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Calculate pagination
  const totalPages = Math.ceil(product.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = product.slice(startIndex, endIndex);

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
      {product.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products available.</p>
      ) : (
        <>
          <div className="product-card grid grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <Link
                to={`/products/${item.id}`}
                key={item.id}
                className="product-card__item border border-gray-300 rounded-lg p-4 flex flex-col justify-between gap-5"
              >
                <div>
                  <img
                    className="product-card__image"
                    src={item.imageUrl}
                    alt={item.productName}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="flex justify-between">
                  <div className="product-card__info">
                    <h3 className="product-card__name pb-2">
                      {item.productName}
                    </h3>
                    <p className="product-card__price">
                      {formatPrice(item.price)}đ
                    </p>
                  </div>
                  <div className="product-card__actions flex flex-col self-center">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">
                      Add to cart
                    </button>
                  </div>
                </div>
              </Link>
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
