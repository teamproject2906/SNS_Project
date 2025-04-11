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



  // Fetch wishlist data from API
  const fetchWishlist = async () => {
    
    if (!user || !user.userId) {
      setFavouriteItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`http://localhost:8080/api/wishlist/user/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.productIds) {
        // We need to fetch the full product details for each productId
        const productPromises = response.data.productIds.map(productId => 
          axios.get(`http://localhost:8080/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        const productResponses = await Promise.all(productPromises);
        const products = productResponses.map(res => res.data);
        
        setFavouriteItems(products);
      } else {
        setFavouriteItems([]);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message);
      if (user && user.userId) {
        toast.error("Không thể tải danh sách yêu thích");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add item to favourites
  const addToFavourites = async (product) => {    
    setUser(getUserInfo())
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await axios.post(
        `http://localhost:8080/api/wishlist/user/${user.userId}/add/${product.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        // Refresh the wishlist after adding
        await fetchWishlist();
        toast.success("Đã thêm sản phẩm vào danh sách yêu thích");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError(err.message);
      toast.error("Không thể thêm sản phẩm vào danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from favourites
  const removeFromFavourites = async (productId) => {
    if (!user || !user.userId) return;
    
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await axios.delete(
        `http://localhost:8080/api/wishlist/user/${user.userId}/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        // Refresh the wishlist after removing
        await fetchWishlist();
        toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích");
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError(err.message);
      toast.error("Không thể xóa sản phẩm khỏi danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  // Check if an item is in favourites
  const isInFavourites = (productId) => {
    return favouriteItems.some((item) => item.id === productId);
  };

  // Get total number of favourite items
  const getTotalFavourites = () => {
    return favouriteItems.length;
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
    fetchWishlist
  };

  return <FavouriteContext.Provider value={value}>{children}</FavouriteContext.Provider>;
};

// PropTypes validation
FavouriteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FavouriteContext; 