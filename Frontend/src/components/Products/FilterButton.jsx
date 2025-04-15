import { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import axios from "axios";
import styles from "../../assets/styles/FilterButton.module.css";
import { getToken } from "../../pages/Login/app/static";
import ModalFilter from "../share/ModalFilter";

const FilterButton = ({ products, onFilter, isOpen, onClose }) => {
  // State để lưu giá trị giá tiền
  const [priceRange, setPriceRange] = useState([100000, 1000000]);

  // State để lưu giá trị category
  const [category, setCategory] = useState("");

  // State để lưu danh sách categories từ API
  const [categories, setCategories] = useState([]);

  // State để xử lý trạng thái loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories từ API khi component mount
  useEffect(() => {
    const handleGetCategory = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const safeCategories = Array.isArray(res.data) ? res.data : [];
        setCategories(safeCategories);
      } catch (error) {
        setError("Error fetching categories: " + error.message);
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    handleGetCategory();
  }, []);

  // Hàm xử lý thay đổi giá tiền
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  // Hàm xử lý thay đổi category
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  // Gửi giá trị lọc lên component cha và đóng modal
  const handleFilter = () => {
    onFilter({ priceRange, category });
    onClose();
  };

  // Reset filters
  const handleReset = () => {
    setPriceRange([100000, 1000000]);
    setCategory("");
    onFilter({ priceRange: [100000, 1000000], category: "" });
    // Note: Not closing modal to allow further adjustments
  };

  return (
    <ModalFilter
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Products"
      onReset={handleReset}
      onSubmit={handleFilter}
    >
      <div>
        {/* Phần Giá */}
        <div className={styles["filter-section"]}>
          <h3>Price range</h3>
          <div className={styles["price-range"]}>
            <ReactSlider
              className={styles["horizontal-slider"]}
              thumbClassName={styles["thumb"]}
              trackClassName={styles["track"]}
              min={100000}
              max={1000000}
              value={priceRange}
              onChange={handlePriceChange}
              pearling
              minDistance={100000}
            />
            <div className={styles["price-values"]}>
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Phần Category */}
        <div className={styles["filter-section"]}>
          <h3>Category</h3>
          {loading ? (
            <p>Loading categories...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <select value={category} onChange={handleCategoryChange}>
              <option value="">All</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </ModalFilter>
  );
};

export default FilterButton;