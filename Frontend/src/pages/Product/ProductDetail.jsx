import { useEffect, useState, useRef } from "react";
import CommentsSection from "../../components/CommentsSection/CommentsSection";
import axios from "axios";
import { getToken } from "../Login/app/static";
import { useCart } from "../../context/CartContext";
import { useFavourite } from "../../context/FavouriteContext";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const { addToCart } = useCart();
  const { addToFavourites, removeFromFavourites, isInFavourites } = useFavourite();
  const { user } = useUser();

  const productId = window.location.pathname.split("/")[2];
  console.log("Product ID:", productId);

  useEffect(() => {
    const fetchedProduct = async () => {
      try {
        const token = getToken();
        const productRes = await axios.get(
          `http://localhost:8080/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(productRes.data);
        console.log("Product:", productRes.data);

        const imagesRes = await axios.get(
          `http://localhost:8080/api/product-gallery/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProductImages(imagesRes.data);
        if (imagesRes.data.length > 0) {
          setSelectedImage(imagesRes.data[0].imageUrl);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchedProduct();
  }, [productId]);

  const scrollToThumbnail = (index) => {
    if (thumbnailsRef.current) {
      const thumbnailHeight = 100; // 500px / 5 thumbnails = 100px each
      const scrollPosition = index * thumbnailHeight;
      thumbnailsRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
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
      alert("Số lượng phải lớn hơn 0");
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
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    
    const productToAdd = {
      id: product.id,
      productName: product.productName,
      price: product.promotion 
        ? product.price - product.price * product.promotion.discount 
        : product.price,
      quantity: quantity,
      imageUrl: selectedImage || product.imageUrl,
      color: selectedColor,
      size: selectedSize
    };
    
    addToCart(productToAdd);
  };

  const handleToggleFavourite = () => {
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

  if (loading) {
    return <p style={{ textAlign: "center" }}>Đang tải...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!product) {
    return <p style={{ textAlign: "center" }}>Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex">
        {/* Phần hình ảnh sản phẩm */}
        <div className="w-1/2">
          <div className="imageLayout flex flex-row justify-center gap-10">
            <div
              ref={thumbnailsRef}
              className="thumbnails flex overflow-y-auto flex-col max-h-[500px] gap-1"
              style={{ scrollbarWidth: "none" }}
            >
              {productImages.map((image, index) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt="Thumbnail"
                  className={`w-20 h-[80px] rounded-lg cursor-pointer border-2 object-cover ${
                    selectedImage === image.imageUrl
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleImageSelect(image.imageUrl, index)}
                />
              ))}
            </div>
            <div className="main-image mb-4 relative">
              <div className="flex justify-center w-[500px] h-[500px] min-h-[500px] min-w-[500px]">
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.productName}
                  className="w-full h-full rounded-lg border-2 border-gray-400"
                  style={{ maxHeight: "500px", objectFit: "contain" }}
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
        <div className="w-1/2 flex flex-col justify-between">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{product.productName}</h1>
          </div>

          <div className="mb-4 flex flex-row items-center gap-2">
            <p className="text-base font-medium">Product code:</p>
            <p className="text-base text-Montserrat-500">
              {product.productCode}
            </p>
            <button 
              className={`favoriteBtn border-2 rounded-full p-1 ${isInFavourites(product.id) ? 'text-red-500' : 'text-gray-400'}`}
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
              ) : (
                ""
              )}
              {product.promotion ? (
                <span className="promotion bg-red-500 p-1 w-12 flex justify-center rounded-md font-bold text-white">
                  -{product.promotion.discount * 100}%
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Description:</h3>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div> */}

          {/* <div className="mb-4 flex flex-row gap-2">
            <h3 className="text-base font-medium mb-2">Material:</h3>
            <p className="text-base">{product.material}</p>
          </div> */}

          {/* Chọn màu sắc */}
          <div className="mb-4 flex flex-row items-center gap-2">
            <h3 className="text-sm font-medium">Choose color:</h3>
            <div className="flex gap-2">
              <button
                key={product.color}
                className={`px-4 py-2 border-2 rounded-lg ${
                  selectedColor === product.color
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                }`}
                onClick={() => handleColorSelect(product.color)}
              >
                {product.color}
              </button>
            </div>
          </div>

          {/* Chọn kích thước */}
          <div className="mb-4 flex flex-row gap-2 items-center">
            <h3 className="text-sm font-medium">Choose size:</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                key={product.sizeChart.value}
                className={`px-4 py-2 border-2 rounded-lg ${
                  selectedSize === product.sizeChart.value
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                }`}
                onClick={() => handleSizeSelect(product.sizeChart.value)}
              >
                {product.sizeChart.value}
              </button>
            </div>
          </div>

          {/* Số lượng */}
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
              className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>

          {/* Nút Add to Cart */}
          <div className="mb-4 flex flex-row gap-2">
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg w-full">
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
            <li>Material:</li>
            <div>{product.material}</div>
          </div>
          <div className="flex flex-row gap-2">
            <li>Form:</li>
            <div>{product.formClothes.formClothes}</div>
          </div>
        </ul>
        <p className="">Description:</p>
        <p className="">{product.description}</p>
      </div>

      {/* Phần bình luận */}
      <div className="mt-8">
        <CommentsSection />
      </div>
    </div>
  );
};

export default ProductDetail;