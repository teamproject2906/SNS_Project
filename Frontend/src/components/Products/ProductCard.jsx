import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../pages/Login/app/static";
import { useFavourite } from "../../context/FavouriteContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { addToFavourites, removeFromFavourites, isInFavourites } = useFavourite();
  const { addToCart } = useCart();
  const { user } = useUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    
    const productToAdd = {
      id: product.id,
      productName: product.productName,
      price: product.promotion 
        ? product.price - product.price * product.promotion.discount 
        : product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      color: product.color,
      size: product.size
    };
    
    addToCart(productToAdd);
  };
  
  const handleToggleFavourite = (product) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích");
      return;
    }
    
    if (isInFavourites(product.id)) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden product-card"
          >
            <Link to={`/products/${item.id}`}>
              <div className="product-card__image">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-64 object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/products/${item.id}`}>
                <h3 className="text-lg font-semibold mb-2 product-card__title">
                  {item.productName}
                </h3>
              </Link>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-bold product-card__price">
                  {item.price.toLocaleString()}₫
                </p>
                {item.promotion && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -{Math.round(item.promotion.discount * 100)}%
                  </span>
                )}
              </div>
              <div className="product-card__actions flex flex-row gap-2">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to cart
                </button>
                <button 
                  className={`favoriteBtn ${isInFavourites(item.id) ? 'text-red-500' : 'text-gray-400'}`}
                  onClick={() => handleToggleFavourite(item)}
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;