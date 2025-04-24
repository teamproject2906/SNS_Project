import { useEffect, useState } from "react";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";

const TopProduct = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [images, setImages] = useState([]);

  const fetchTopProduct = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/api/v1/order-details/best",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Limit to top 5 products
      setProducts(res.data.slice(0, 3));
      if (res.data.length > 0) {
        setProductId(res.data[0].productId);
      }
      console.log("Top Products:", res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error.response?.data.message || "Failed to fetch top products"
      );
    }
  };

  const fetchImage = async () => {
    if (!productId) return;
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:8080/api/product-gallery/getImageByProductId/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setImages(res.data);
      console.log("Images:", res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error(error.response?.data.message || "Failed to fetch images");
    }
  };

  useEffect(() => {
    fetchTopProduct();
  }, []);

  useEffect(() => {
    fetchImage();
  }, [productId]);

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl mb-4">Top Product</h2>
      <ul className="space-y-4">
        {products?.map((item) => {
          const firstImage = images.find(
            (img) => img.product.id === item.productId
          );

          return (
            <li
              key={item.id}
              className="flex items-center bg-white shadow-md rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex-shrink-0 w-12 text-gray-600 font-semibold">
                {item.productId}
              </div>
              <div className="flex-shrink-0 mx-4">
                {firstImage ? (
                  <img
                    src={firstImage.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-grow text-gray-800 font-medium">
                {item.productName}
              </div>
              <div className="flex-shrink-0 text-gray-600">
                {item.quantitySold} sold
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopProduct;