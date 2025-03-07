import { useEffect, useState } from "react";
import CommentsSection from "../../components/CommentsSection/CommentsSection";

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  // const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        const response = await fetch(
          "https://6785f704f80b78923aa4e3be.mockapi.io/product/1",
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

  // const handleSizeSelect = (size) => {
  //   setSelectedSize(size);
  // };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      alert("Quantity must be greater than 0");
    }
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
    <div>
      {Object.keys(product).length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="outlineProduct flex justify-center">
          <div className="productImage pr-8">
            <img
              src={product.productImage}
              alt={product.productName}
              width={400}
              height={400}
            />
          </div>
          <div className="productDetail flex flex-col gap-11">
            <div>
              <h1 className="productName text-2xl">{product.productName}</h1>
            </div>
            <div>
              <p className="description max-sm:text-sm">
                {product.description}
              </p>
            </div>
            <div className="colorContainer flex gap-10">
              <h3 className="color-title pr-2">Chọn màu:</h3>
              {product.color.map((color, index) => (
                <div
                  key={index}
                  className="colorBox rounded-full border-2 w-10 h-10 flex justify-center items-center hover:border-black cursor-pointer"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            {/* <div className="size flex">
              <h3 className="size-title pr-10">Choose Size:</h3> */}
            <div className="size-container flex gap-10">
              <h3 className="size-title pr-4">Chọn size:</h3>
              {product.size.map(
                (size, index) => (
                  {
                    /* <div
                    key={index}
                    className={`size-box  ${selectedSize === size ? "active" : ""}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </div> */
                  },
                  (
                    <div
                      key={index}
                      className={
                        "size border-inherit border-2 w-10 h-10 flex justify-center items-center hover:border-black cursor-pointer"
                      }
                    >
                      {size}
                    </div>
                  )
                )
              )}
              {/* </div> */}
            </div>
            <div>
              <p>Giá tiền: {formatPrice(product.price)} VND</p>
            </div>
            <div className="productQuantity flex gap-3">
              <button
                className="minusIcon border-inherit border-2 px-4 py-1"
                onClick={handleMinus}
              >
                -
              </button>
              <div className="recentQuantity flex items-center">{quantity}</div>
              <button
                className="plusIcon border-inherit border-2 px-4 py-1"
                onClick={handlePlus}
              >
                +
              </button>
            </div>
            <div className="outlineBtn">
              <button className="addToCart bg-sky-500 p-3 rounded-lg text-white">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-6 py-8">
        <CommentsSection />
      </div>
    </div>
  );
};

export default ProductDetail;
