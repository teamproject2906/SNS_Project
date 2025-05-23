import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { FavouriteProvider } from "./context/FavouriteContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <CartProvider>
      <FavouriteProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </FavouriteProvider>
    </CartProvider>
  </>
  // </StrictMode>
);
