
const FilterSidebar = () => {
  const categories = ["T-SHIRT", "SHIRT", "TANK TOP", "JACKETS", "PANTS", "SHORTS"];
  const priceRanges = [
    "dưới 500,000đ",
    "500,000đ - 1,000,000đ",
    "1,000,000đ - 1,500,000đ",
    "trên 1,500,000đ",
  ];
  const sizes = ["XXL", "XL", "L/XL", "L", "M/L", "M", "S/M", "S", "SX"];

  return (
    <div className="w-full max-w-xs border p-4">
      {/* Categories */}
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">PRODUCTS</h3>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="mb-1">
              <a
                href="#"
                className="text-gray-700 hover:text-black transition-colors"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <hr className="my-4" />

      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">KHOẢNG GIÁ</h3>
        <ul>
          {priceRanges.map((range, index) => (
            <li key={index} className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  value={range}
                />
                <span className="text-gray-700">{range}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="my-4" />

      {/* Sizes */}
      <div>
        <h3 className="font-bold text-lg mb-2">KÍCH THƯỚC</h3>
        <ul>
          {sizes.map((size, index) => (
            <li key={index} className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  value={size}
                />
                <span className="text-gray-700">{size}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSidebar;
