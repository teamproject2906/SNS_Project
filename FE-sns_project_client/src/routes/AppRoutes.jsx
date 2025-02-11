import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Các trang (các phần này sẽ thêm sau)
import HomePage from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";
import Product from "../pages/Product/Product";
import Breadcrumb from "../components/share/breadcrumb";
import ProductDetail from "../pages/Product/ProductDetail";

// Giả lập trạng thái Auth
const isAuthenticated = false; // Kiểm tra trạng thái đăng nhập

// Cấu hình routes
const routes = [
  {
    path: "/", // Trang Home, cho mọi user
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: "/login", // Trang dành cho Guest (Guest-only)
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} guestOnly={true}>
        <MainLayout>
          <Login />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*", // Trang 404
    element: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <MainLayout>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/products",
    element: (
      <MainLayout>
        <Breadcrumb />
        <Product />
      </MainLayout>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <MainLayout>
        <Breadcrumb />
        <ProductDetail />
      </MainLayout>
    ),
  },
];

const AppRoutes = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
