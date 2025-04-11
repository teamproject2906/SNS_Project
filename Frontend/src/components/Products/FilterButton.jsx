import { useState } from "react";
import ReactSlider from "react-slider"; // Giả định rằng react-slider đã được import
import "../../assets/styles/FilterButton.module.css";

const FilterButton = ({ products, onFilter }) => {
  // State để lưu giá trị giá tiền
  const [priceRange, setPriceRange] = useState([300000, 45000000]);

  // State để lưu giá trị category
  const [category, setCategory] = useState("");

  // Đảm bảo products là mảng, nếu không thì gán mảng rỗng
  const safeProducts = Array.isArray(products) ? products : [];

  // Tạo danh sách category động từ safeProducts
  const categories = [
    ...new Set(
      safeProducts
        .map((product) => product?.category?.name)
        .filter((cat) => cat)
    ),
  ];

  // Hàm xử lý thay đổi giá tiền
  const handlePriceChange = (value) => {
    setPriceRange(value); // ReactSlider trả về mảng [min, max]
  };

  // Hàm xử lý thay đổi category
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  // Gửi giá trị lọc lên component cha khi nhấn nút "Tìm kiếm"
  const handleFilter = () => {
    onFilter({ priceRange, category });
  };

  return (
    <div className="filter-form">
      {/* Phần Giá */}
      <div className="filter-section">
        <h3>Giá</h3>
        <div className="price-range">
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            min={300000}
            max={45000000}
            value={priceRange}
            onChange={handlePriceChange}
            pearling
            minDistance={100000} // Khoảng cách tối thiểu giữa hai thumb
          />
          <div className="price-values">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Phần Category */}
      <div className="filter-section">
        <h3>Category</h3>
        <select value={category} onChange={handleCategoryChange}>
          <option value="">Tất cả</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Nút tìm kiếm */}
      <button className="search-button" onClick={handleFilter}>
        Tìm kiếm
      </button>
    </div>
  );
};

export default FilterButton;
