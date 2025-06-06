import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken, getUserInfo } from "../pages/Login/app/static";
import { toast } from "react-toastify";

// Create the context
const FavouriteContext = createContext();

// Custom hook to use the favourite context
export const useFavourite = () => {
  return useContext(FavouriteContext);
};

// Provider component
export const FavouriteProvider = ({ children }) => {
  // Initialize favourite state
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(getUserInfo());
  console.log(user);

  // Fetch wishlist data from API
  const fetchWishlist = async () => {
    if (!user || !user.id) {
      setFavouriteItems([]);
      return;
    }
    console.log("Userdmm:", user);
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8080/api/wishlist/user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.productIds) {
        // We need to fetch the full product details for each productId
        const productPromises = response.data.productIds.map((productId) =>
          axios.get(
            `http://localhost:8080/api/products/getDetail/${productId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        );

        const productResponses = await Promise.all(productPromises);
        const products = productResponses.map((res) => res.data);

        setFavouriteItems(products);
      } else {
        setFavouriteItems([]);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message);
      if (!user && !user.userId) {
        toast.error("Error fetching wishlist!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist on component mount
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id]);

  // Add item to favourites
  const addToFavourites = async (product) => {
    const currentUser = getUserInfo();
    if (!currentUser || !currentUser.id) {
      toast.error("Please log in to add to wishlist!");
      return;
    }
    if (!product || !product.id) {
      toast.error("Invalid product!");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        toast.error("Authentication token is missing!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/wishlist/user/${currentUser.id}/add/${product.id}`,
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        await fetchWishlist();
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err.response?.data);
      setError(err.message);
      toast.error(err.response?.data?.message || "Error adding to wishlist!");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from favourites
  const removeFromFavourites = async (productId) => {
    if (!user || !user.id) return;

    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.delete(
        `http://localhost:8080/api/wishlist/user/${user.id}/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        // Refresh the wishlist after removing
        await fetchWishlist();
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError(err.message);
      toast.error("Error removing from wishlist!");
    } finally {
      setLoading(false);
    }
  };

  // Calculate price after promotion
  const getPriceAfterPromotion = (product) => {
    if (product?.promotion && product.promotion.discount) {
      return product.price * (1 - product.promotion.discount);
    }
    return product.price;
  };

  // Check if an item is in favourites
  const isInFavourites = (productId) => {
    return favouriteItems.some((item) => item.id === productId);
  };

  // Get total number of favourite items
  const getTotalFavourites = () => {
    return favouriteItems.length;
  };

  const clearFavourite = () => {
    setFavouriteItems([]);
    setUser(null);
    setError(null);
    setLoading(false);
  };

  // Context value
  const value = {
    favouriteItems,
    loading,
    error,
    addToFavourites,
    removeFromFavourites,
    isInFavourites,
    getTotalFavourites,
    fetchWishlist,
    getPriceAfterPromotion,
    clearFavourite,
    setUser,
  };

  return (
    <FavouriteContext.Provider value={value}>
      {children}
    </FavouriteContext.Provider>
  );
};

// PropTypes validation
FavouriteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FavouriteContext;
