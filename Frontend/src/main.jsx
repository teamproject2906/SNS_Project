import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { FavouriteProvider } from "./context/FavouriteContext.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UserProvider>
    <CartProvider>
      <FavouriteProvider>
        <App />
        <ToastContainer />
      </FavouriteProvider>
    </CartProvider>
  </UserProvider>
  // </StrictMode>
);
