import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken, getUserInfo } from "../pages/Login/app/static";
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
  const [user, setUser] = useState(getUserInfo());
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState(null);

  // Fetch cart data from API
  const fetchCart = async () => {
    if (!user || !user.userId) {
      setCartItems([]);
      return;
    }

    try {
   
      const token = getToken();
    
      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/${user.userId}`,
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
      console.error("Error fetching cart:", err);
      setError(err.message);
      if (user && user.userId) {
        toast.error("Không thể tải giỏ hàng");
      }
    }
  };

  // Fetch cart on component mount and when user changes

  // Add item to cart
  const addToCart = async (product) => {
    setUser(getUserInfo());

    if (!user || !user.userId) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
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
      };

      const response = await axios.post(
        `http://localhost:8080/api/v1/cart/${user.userId}/add`,
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
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, [ user ]);

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    if (!user || !user.userId) return;

    try {
      setLoading(true);
      const token = getToken();

      await axios.delete(
        `http://localhost:8080/api/v1/cart/${user.userId}/remove/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local cart state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message);
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!user || !user.userId) return;

    if (quantity <= 0 || quantity.isNaN) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      
      const token = getToken();

      const response = await axios.put(
        `http://localhost:8080/api/v1/cart/update-quantity?userId=${user.userId}&cartItemId=${cartItemId}&quantity=${quantity}`,
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
      toast.error("Không thể cập nhật số lượng sản phẩm");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user || !user.userId) return;

    try {
      setLoading(true);
      const token = getToken();

      await axios.delete(
        `http://localhost:8080/api/v1/cart/${user.userId}/clear`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartItems([]);
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.message);
      toast.error("Không thể xóa giỏ hàng");
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
  console.log("CartItem", cartItems);

  // Context value
  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCart,
    getPriceAfterPromotion,
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// PropTypes validation
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext;
