import { createContext, useContext, useState, useEffect } from "react";
import userService from "../services/userService";
import { useCart } from "./CartContext";
import { useFavourite } from "./FavouriteContext";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "");
    return token && storedUser ? JSON.parse(storedUser) : null;
  });

  const { setUser: setCartUser } = useCart();
  const { setUser: setWishlistUser } = useFavourite();

  const fetchUser = async () => {
    try {
      const userInfo = await userService.getUserProfileByEmail(user.email);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
      setCartUser(userInfo);
      setWishlistUser(userInfo);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (user) {
      if (!user?.id && user?.email) {
        fetchUser();
      } else {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
