import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Hardcoded initial cart data
const initialCartItems = [
  {
    id: 1,
    name: "Áo thun nam",
    price: 199000,
    quantity: 2,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Quần jean nam",
    price: 299000,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Giày thể thao",
    price: 499000,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

// Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state with hardcoded data
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If it exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it doesn't exist, add new item
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Context value
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// PropTypes validation
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext; 