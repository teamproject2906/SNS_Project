import Header from "./common/Header";
import Footer from "./common/Footer";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";

const MainLayout = ({ children, className }) => {
  const { fetchCart } = useCart();
  const { fetchWishlist } = useFavourite();

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  return (
    <>
      <Header />
      <main className={`min-h-screen p-4 ${className}`}>{children}</main>
      <Footer />
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default MainLayout;
