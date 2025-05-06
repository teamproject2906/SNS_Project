import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommentsSection from "../../components/CommentsSection/CommentsSection";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useFavourite } from "../../context/FavouriteContext";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const thumbnailsRef = useRef(null);
  const { addToCart, clearCart } = useCart();
  const { addToFavourites, removeFromFavourites, isInFavourites } =
    useFavourite();
  const { user } = useUser();
  const location = useLocation();

  const productId = window.location.pathname.split("/")[2];
  const productCode = location.state?.productCode;

  useEffect(() => {
    const fetchedProduct = async () => {
      if (!productCode) {
        setError("Product code not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch products by productCode
        const productRes = await axios.get(
          `http://localhost:8080/api/products/productCode/${productCode}`,
          {
            headers: "Content-Type: application/json",
          }
        );

        // Handle API response (expecting an array)
        const products = Array.isArray(productRes.data)
          ? productRes.data
          : [productRes.data];
        if (!products.length || !products[0].price) {
          throw new Error("Product data or price not valid");
        }

        // Set primary product (first in array)
        setProduct(products[0]);
        // Store all variants for color/size filtering
        setProductVariants(products);

        // Fetch product images
        const imagesRes = await axios.get(
          `http://localhost:8080/api/products/images/productCode/${productCode}`,
          {
            headers: "Content-Type: application/json",
          }
        );
        setProductImages(imagesRes.data);
        if (imagesRes.data.length > 0) {
          setSelectedImage(imagesRes.data[0].imageUrl);
        }

        if (productId) {
          // Fetch feedback for average rating
          const feedbackRes = await axios.get(
            `http://localhost:8080/api/feedbacks/product/${productId}`,
            {
              headers: "Content-Type: application/json",
            }
          );
          const feedbacks = feedbackRes.data;
          if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce(
              (sum, feedback) => sum + feedback.rate,
              0
            );
            const avgRating = totalRating / feedbacks.length;
            setAverageRating(parseFloat(avgRating.toFixed(1)));
          }
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchedProduct();
  }, [productId, productCode]);

  const scrollToThumbnail = (index) => {
    if (thumbnailsRef.current) {
      const thumbnailHeight = 100;
      const scrollPosition = index * thumbnailHeight;
      thumbnailsRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleColorSelect = (color) => {
    if (selectedColor === color) {
      // Deselect color if clicked again
      setSelectedColor("");
    } else {
      setSelectedColor(color);
      // Reset size if it’s not available for the selected color
      const availableSizesForColor = [
        ...new Set(
          productVariants
            .filter((p) => p.color === color)
            .map((p) => p.sizeChart.value)
        ),
      ];
      if (!availableSizesForColor.includes(selectedSize)) {
        setSelectedSize("");
      }
    }
  };

  const handleSizeSelect = (size) => {
    if (selectedSize === size) {
      // Deselect size if clicked again
      setSelectedSize("");
    } else {
      setSelectedSize(size);
      // Reset color if it’s not available for the selected size
      const availableColorsForSize = [
        ...new Set(
          productVariants
            .filter((p) => p.sizeChart.value === size)
            .map((p) => p.color)
        ),
      ];
      if (!availableColorsForSize.includes(selectedColor)) {
        setSelectedColor("");
      }
    }
  };

  const handleImageSelect = (imageUrl, index) => {
    setSelectedImage(imageUrl);
    setImageIndex(index);
    scrollToThumbnail(index);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      alert("Quantity must be at least 1");
    }
  };

  const handlePrevImage = () => {
    const newIndex = imageIndex > 0 ? imageIndex - 1 : productImages.length - 1;
    setImageIndex(newIndex);
    setSelectedImage(productImages[newIndex].imageUrl);
    scrollToThumbnail(newIndex);
  };

  const handleNextImage = () => {
    const newIndex = imageIndex < productImages.length - 1 ? imageIndex + 1 : 0;
    setImageIndex(newIndex);
    setSelectedImage(productImages[newIndex].imageUrl);
    scrollToThumbnail(newIndex);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "N/A";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Please select a color!");
      return;
    }

    if (product.quantityInventory === 0) {
      toast.error("Out of stock!");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    // Find the variant matching selected color and size
    const selectedVariant = productVariants.find(
      (p) => p.color === selectedColor && p.sizeChart.value === selectedSize
    );

    if (!selectedVariant) {
      toast.error("Selected variant not found!");
      return;
    }
    console.log(selectedImage || selectedVariant.imageUrl);

    const productToAdd = {
      id: selectedVariant.id,
      productName: selectedVariant.productName,
      price: selectedVariant.promotion
        ? selectedVariant.price -
          selectedVariant.price * selectedVariant.promotion.discount
        : selectedVariant.price,
      quantity: quantity,
      imageUrl: selectedImage || selectedVariant.imageUrl,
      color: selectedColor,
      size: selectedSize,
    };

    addToCart(productToAdd);
  };

  const handleBuyNow = async () => {
    try {
      if (!selectedColor) {
        toast.error("Please select a color!");
        return;
      }

      if (product.quantityInventory === 0) {
        toast.error("Out of stock!");
        return;
      }

      if (!selectedSize) {
        toast.error("Please select a size!");
        return;
      }

      // Find the variant matching selected color and size
      const selectedVariant = productVariants.find(
        (p) => p.color === selectedColor && p.sizeChart.value === selectedSize
      );

      if (!selectedVariant) {
        toast.error("Selected variant not found!");
        return;
      }

      const productToAdd = {
        id: selectedVariant.id,
        productName: selectedVariant.productName,
        price: selectedVariant.promotion
          ? selectedVariant.price -
            selectedVariant.price * selectedVariant.promotion.discount
          : selectedVariant.price,
        quantity: quantity,
        imageUrl: selectedImage || selectedVariant.imageUrl,
        color: selectedColor,
        size: selectedSize,
      };
      await clearCart();
      await addToCart(productToAdd);
      navigate("/checkout");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to buy. Please try again.");
    }
  };

  const handleToggleFavourite = () => {
    if (!user) {
      toast.warn("Please log in to add to favourites!");
      return;
    }

    if (isInFavourites(product.id)) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!product || !productVariants.length) {
    return <p style={{ textAlign: "center" }}>Product not found</p>;
  }

  // All colors and sizes (for rendering)
  const allColors = [...new Set(productVariants.map((p) => p.color))];
  const allSizes = [...new Set(productVariants.map((p) => p.sizeChart.value))];
  // Convert specialColor array to a lookup object
  const specialColorMap = Object.fromEntries(
    [
      { name: "Red-Orange", value: "#e75113" },
      { name: "Yellow-Orange", value: "#f59e0b" },
      { name: "Yellow-Green", value: "#a3e635" },
      { name: "Blue-Purple", value: "#4f46e5" },
      { name: "Red-Purple", value: "#d946ef" },
    ].map((sc) => [sc.name, sc.value])
  );

  // Valid colors and sizes for disabling
  const validColors = selectedSize
    ? [
        ...new Set(
          productVariants
            .filter((p) => p.sizeChart.value === selectedSize)
            .map((p) => p.color)
        ),
      ]
    : allColors;
  const validSizes = selectedColor
    ? [
        ...new Set(
          productVariants
            .filter((p) => p.color === selectedColor)
            .map((p) => p.sizeChart.value)
        ),
      ]
    : allSizes;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Phần hình ảnh sản phẩm */}
        <div className="w-full md:w-1/2">
          <div className="imageLayout flex flex-col-reverse md:flex-row justify-center gap-10">
            <div
              ref={thumbnailsRef}
              className="thumbnails flex flex-row md:flex-col overflow-auto gap-1"
              style={{ scrollbarWidth: "none" }}
            >
              {productImages.map((image, index) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt="Thumbnail"
                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 object-cover ${
                    selectedImage === image.imageUrl
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleImageSelect(image.imageUrl, index)}
                />
              ))}
            </div>
            <div className="main-image mb-4 relative">
              <div className="flex justify-center w-full aspect-square">
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.productName}
                  className="w-full h-full rounded-lg border-2 border-gray-300 object-cover"
                />
              </div>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full opacity-75 hover:opacity-100"
                onClick={handlePrevImage}
              >
                ◀
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full opacity-75 hover:opacity-100"
                onClick={handleNextImage}
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* Phần thông tin sản phẩm */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">
              {product.productName}
              {product.quantityInventory ? (
                <span className="ml-2 bg-green-500 text-white py-1 px-2 rounded text-sm">
                  IN STOCK
                </span>
              ) : (
                <span className="ml-2 bg-red-500 text-white py-1 px-2 rounded text-sm">
                  SOLD OUT
                </span>
              )}
            </h1>
            <div className="average-rating mt-2 flex items-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFull = averageRating >= star;
                const isHalf =
                  averageRating >= star - 0.5 && averageRating < star;

                return (
                  <span
                    key={star}
                    className="star relative inline-block text-2xl"
                  >
                    <span className="empty-star text-gray-300">★</span>
                    <span
                      className="filled-star absolute top-0 left-0 text-yellow-400 overflow-hidden"
                      style={{
                        width: isFull ? "100%" : isHalf ? "50%" : "0%",
                      }}
                    >
                      ★
                    </span>
                  </span>
                );
              })}
              <span className="ml-2 text-gray-600">
                {averageRating > 0 ? `${averageRating} stars` : "No reviews"}
              </span>
            </div>
          </div>

          <div className="mb-4 flex flex-row items-center gap-2">
            <p className="text-base font-medium">Product Code:</p>
            <p className="text-base text-Montserrat-500">
              {product.productCode}
            </p>
            <button
              className={`favoriteBtn border-2 rounded-full p-1 ${
                isInFavourites(product.id) ? "text-red-500" : "text-gray-400"
              }`}
              onClick={handleToggleFavourite}
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

          <div className="mb-4">
            <div className="flex items-center gap-2">
              {product.promotion ? (
                <span className="text-2xl font-bold text-[#021f58]">
                  {formatPrice(
                    product.price - product.price * product.promotion.discount
                  )}
                  đ
                </span>
              ) : (
                <span className="text-2xl font-bold text-[#021f58]">
                  {formatPrice(product.price)}đ
                </span>
              )}
              {product.promotion ? (
                <span
                  className="text-md font-bold text-gray-400"
                  style={{ textDecoration: "line-through" }}
                >
                  {formatPrice(product.price)}đ
                </span>
              ) : null}
              {product.promotion ? (
                <span className="promotion bg-red-500 p-1 w-12 flex justify-center rounded-md font-bold text-white">
                  -{product.promotion.discount * 100}%
                </span>
              ) : null}
            </div>
          </div>

          <div className="mb-4 flex flex-row items-center gap-2">
            <h3 className="text-sm font-medium">Choose color:</h3>
            <div className="flex gap-2 flex-wrap">
              {allColors.length > 0 ? (
                allColors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border-2 rounded-lg ${
                      selectedColor === color
                        ? "border-blue-500 bg-blue-100"
                        : validColors.includes(color)
                        ? "border-gray-300"
                        : "border-gray-300 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => handleColorSelect(color)}
                    disabled={!validColors.includes(color)}
                    style={{
                      backgroundColor: specialColorMap[color]
                        ? specialColorMap[color]
                        : color,
                      color: color === "White" ? "black" : "white",
                      padding: "1rem",
                      borderRadius: "10rem",
                    }}
                  >
                    {/* {color} */}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">Color not available</p>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-row gap-2 items-center">
            <h3 className="text-sm font-medium">Choose size:</h3>
            <div className="flex gap-2 flex-wrap">
              {allSizes.length > 0 ? (
                allSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border-2 rounded-lg ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-100"
                        : validSizes.includes(size)
                        ? "border-gray-300"
                        : "border-gray-300 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => handleSizeSelect(size)}
                    disabled={!validSizes.includes(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">Size not available</p>
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                className="px-4 py-2 text-lg"
                onClick={handleMinus}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button className="px-4 py-2 text-lg" onClick={handlePlus}>
                +
              </button>
            </div>
            <button
              className="bg-black text-white px-6 py-3 rounded-lg w-full font-bold"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>

          <div className="mb-4 flex flex-row gap-2">
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg w-full font-bold"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      <hr
        style={{
          height: "2px",
          borderWidth: "0",
          color: "gray",
          backgroundColor: "gray",
          marginTop: "5%",
        }}
      />
      <div className="description mt-8 gap-2 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{product.productName}</h2>
        <ul className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <li className="font-bold underline">Material:</li>
            <div>{product.material}</div>
          </div>
          <div className="flex flex-row gap-2">
            <li className="font-bold underline">Form:</li>
            <div>{product.formClothes?.formClothes}</div>
          </div>
        </ul>
        <p className="font-bold underline">Description:</p>
        <p>{product.description}</p>
      </div>

      <div className="mt-8">
        <CommentsSection productId={productId} />
      </div>
    </div>
  );
};

export default ProductDetail;
