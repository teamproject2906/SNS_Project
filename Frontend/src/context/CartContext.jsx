import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken } from "../pages/Login/app/static";
import { toast } from "react-toastify";

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState(null);

  // Fetch cart data from API
  const fetchCart = async () => {
    if (!user || !user.id) {
      setCartItems([]);
      return;
    }

    try {
      const token = getToken();

      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err.message);
      if (user && user.id) {
        toast.error("Can't fetch cart");
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user?.id]);

  // Fetch cart on component mount and when user changes

  // Add item to cart
  const addToCart = async (product) => {
    setUser(JSON.parse(localStorage.getItem("user")));
    if (!user || !user.id) {
      toast.error("Please login to add product to cart!");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      // Prepare cart item data
      const cartItemData = {
        productId: product.id,
        quantity: product.quantity || 1,
        color: product.color,
        size: product.size,
        imageUrl: product.imageUrl,
      };

      const response = await axios.post(
        `http://localhost:8080/api/v1/cart/${user.id}/add`,
        cartItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        // Update local cart state with the response data
        if (response.data.items) {
          setCartItems(response.data.items);
        }
        toast.success("Added to cart successfully!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message);
      toast.error(
        err.response?.data.message || "Không thể thêm sản phẩm vào giỏ hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    if (!user || !user.id) return;

    try {
      setLoading(true);
      const token = getToken();

      await axios.delete(
        `http://localhost:8080/api/v1/cart/${user.id}/remove/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local cart state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message);
      toast.error("Error removing from cart!");
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!user || !user.id) return;

    if (quantity <= 0 || quantity.isNaN) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      const token = getToken();

      const response = await axios.put(
        `http://localhost:8080/api/v1/cart/update-quantity?userId=${user.id}&cartItemId=${cartItemId}&quantity=${quantity}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.cartItems) {
        setCartItems(response.data.cartItems);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.message);
      toast.error("Error updating quantity!");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user || !user.id) return;

    try {
      setLoading(true);
      const token = getToken();

      await axios.delete(`http://localhost:8080/api/v1/cart/${user.id}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.message);
      toast.error("Error clearing cart!");
    } finally {
      setLoading(false);
    }
  };

  // Calculate price after promotion
  const getPriceAfterPromotion = (item) => {
    if (item.product?.promotion && item.product.promotion.discount) {
      return item.unitPrice * (1 - item.product.promotion.discount);
    }
    return item.unitPrice;
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const priceAfterPromotion = getPriceAfterPromotion(item);
      return total + priceAfterPromotion * item.quantity;
    }, 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCartLocal = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    setUser(null);
    setError(null);
    setLoading(false);
  };

  // Context value
  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCartLocal,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCart,
    getPriceAfterPromotion,
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
    setUser,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// PropTypes validation
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext;
