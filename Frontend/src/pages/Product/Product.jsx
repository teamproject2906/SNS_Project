import { useState, useEffect } from "react";
import axios from "axios";
import SortBar from "../../components/Products/SortBar";
import ProductCard from "../../components/Products/ProductCard";
import FilterButton from "../../components/Products/FilterButton";
import { getToken } from "../../pages/Login/app/static";
import { IoFilter } from "react-icons/io5";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Sản phẩm nổi bật");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false); // Track if filtering is applied
  const [modalIsOpen, setModalIsOpen] = useState(false); // Control modal visibility

  // Fetch products on mount
  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const safeProducts = Array.isArray(res.data) ? res.data : [];
        setProducts(safeProducts);
        setFilteredProducts(safeProducts); // Initially show all products
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  // Hàm xử lý lọc
  const handleFilter = ({ priceRange, category }) => {
    const [minPrice, maxPrice] = priceRange;
    let filtered = [...products];

    // Lọc theo giá
    filtered = filtered.filter((product) => {
      const price = product.promotion
        ? product.price * (1 - product.promotion.discount)
        : product.price;
      return price >= minPrice && price <= maxPrice;
    });

    // Lọc theo category
    if (category) {
      filtered = filtered.filter(
        (product) => product.category?.categoryName === category
      );
    }

    setFilteredProducts(filtered);
    setIsFiltered(true); // Mark that filtering is applied
    setSortOption("Sản phẩm nổi bật");
  };

  // Handle sorting logic
  const handleSort = (option) => {
    setSortOption(option.label);
    let sortedProducts = [...(isFiltered ? filteredProducts : products)]; // Sort the active list

    switch (option.value) {
      case "price-asc":
        sortedProducts.sort((a, b) => {
          const priceA = a.promotion
            ? a.price * (1 - a.promotion.discount)
            : a.price;
          const priceB = b.promotion
            ? b.price * (1 - b.promotion.discount)
            : b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => {
          const priceA = a.promotion
            ? a.price * (1 - a.promotion.discount)
            : a.price;
          const priceB = b.promotion
            ? b.price * (1 - b.promotion.discount)
            : b.price;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        sortedProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "name-desc":
        sortedProducts.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      case "oldest":
        sortedProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "best-selling":
        sortedProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default:
        sortedProducts = [...(isFiltered ? filteredProducts : products)]; // Preserve current list
        break;
    }

    setFilteredProducts(sortedProducts);
  };

  // Open modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <div className="filterBtn">
          <button
            onClick={openModal}
            className="px-4 py-2 rounded flex flex-row items-center gap-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
          >
            <IoFilter className="text-2xl"/>
            <label>FILTER</label>
          </button>
          <FilterButton
            products={products}
            onFilter={handleFilter}
            isOpen={modalIsOpen}
            onClose={closeModal}
          />
        </div>
        <div className="sortBar">
          <SortBar onSort={handleSort} selectedOption={sortOption} />
        </div>
      </div>
      <div className="w-full">
        <ProductCard
          products={filteredProducts} // Always use filteredProducts
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}