import FilterSidebar from "../../components/Products/FilterSidebar";
import ProductCard from "../../components/Products/ProductCard";


export default function Product() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <FilterSidebar />
      </div>
      <div className="w-3/4">
        <ProductCard />
      </div>
    </div>
  );
}
