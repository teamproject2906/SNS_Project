import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = () => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(9); // Default items to show
  const [expanded, setExpanded] = useState(false); // Expanded state

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        const response = await fetch(
          "https://6785f704f80b78923aa4e3be.mockapi.io/product",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  const showMore = () => {
    setExpanded(!expanded);
    setItemsToShow(expanded ? 9 : product.length);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
        <div className="product-card grid grid-cols-3 gap-4">
          {product.slice(0, itemsToShow).map((item) => (
            <Link
              to={`/products/${item.id}`}
              key={item.id}
              className="product-card__item"
            >
              <img
                className="product-card__image pb-2"
                src={item.productImage}
                alt={item.productName}
                width={300}
                height={300}
              />
              <h3 className="product-card__name pb-2">{item.productName}</h3>
              <p className="product-card__price">{formatPrice(item.price)}đ</p>
            </Link>
          ))}
        </div>
      )}
      {product.length > 9 && (
        <div className="text-center mt-4">
          <button
            onClick={showMore}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
