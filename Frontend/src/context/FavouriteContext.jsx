import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create the context
const FavouriteContext = createContext();

// Custom hook to use the favourite context
export const useFavourite = () => {
  return useContext(FavouriteContext);
};

// Hardcoded initial favourite data
const initialFavouriteItems = [
  {
    id: 1,
    name: "Áo thun nam",
    price: 199000,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Quần jean nam",
    price: 299000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Giày thể thao",
    price: 499000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Áo khoác denim",
    price: 599000,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Túi xách nữ",
    price: 399000,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

// Provider component
export const FavouriteProvider = ({ children }) => {
  // Initialize favourite state with hardcoded data
  const [favouriteItems, setFavouriteItems] = useState(initialFavouriteItems);

  // Add item to favourites
  const addToFavourites = (product) => {
    setFavouriteItems((prevItems) => {
      // Check if product already exists in favourites
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If it exists, do nothing
        return prevItems;
      } else {
        // If it doesn't exist, add new item
        return [...prevItems, product];
      }
    });
  };

  // Remove item from favourites
  const removeFromFavourites = (productId) => {
    setFavouriteItems((prevItems) => prevItems.filter((item) => item.id !== productId));
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
    addToFavourites,
    removeFromFavourites,
    isInFavourites,
    getTotalFavourites,
  };

  return <FavouriteContext.Provider value={value}>{children}</FavouriteContext.Provider>;
};

// PropTypes validation
FavouriteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FavouriteContext; 