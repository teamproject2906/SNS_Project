import { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import axios from "axios";
import styles from "../../assets/styles/FilterButton.module.css";
import { getToken } from "../../pages/Login/app/static";
import ModalFilter from "../share/ModalFilter";
import PropTypes from "prop-types";

const FilterButton = ({ products, onFilter, isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState([100000, 10000000]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGetCategory = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/categories/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Categories:", res.data);
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

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleFilter = () => {
    console.log("Applying filter:", { priceRange, category });
    onFilter({ priceRange, category });
    onClose();
  };

  const handleReset = () => {
    setPriceRange([100000, 10000000]);
    setCategory("");
    onFilter({ priceRange: [100000, 10000000], category: "" });
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
        <div className={styles["filter-section"]}>
          <h3>Price range</h3>
          <div className={styles["price-range"]}>
            <ReactSlider
              className={styles["horizontal-slider"]}
              thumbClassName={styles["thumb"]}
              trackClassName={styles["track"]}
              min={100000}
              max={10000000}
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

FilterButton.propTypes = {
  products: PropTypes.array.isRequired,
  onFilter: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterButton;