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
      setProducts(res.data);
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
    <div className="container mx-auto rounded-xl">
      <label htmlFor="my-modal" className="btn font-bold text-2xl">
        Top Product
      </label>
      <table className="w-full border-collapse rounded-xl">
        <thead className="">
          <tr className="">
            <th className="p-4 text-left font-semibold">ID</th>
            <th className="p-4 text-left font-semibold">Image</th>
            <th className="p-4 text-left font-semibold">Product Name</th>
            <th className="p-4 text-left font-semibold">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((item) => {
            const firstImage = images.find(
              (img) => img.product.id === item.productId
            );

            return (
              <tr
                key={item.id}
                className="border-gray-200 shadow-xl rounded-xl"
              >
                <td className="p-4 text-gray-600">{item.productId}</td>
                <td className="p-4">
                  {firstImage && (
                    <img
                      src={firstImage.imageUrl}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </td>
                <td className="p-4 text-gray-800 font-medium">
                  {item.productName}
                </td>
                <td className="p-4 text-gray-600">{item.quantitySold}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TopProduct;
