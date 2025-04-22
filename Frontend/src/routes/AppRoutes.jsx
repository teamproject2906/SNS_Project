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
import DashBoardPage from "../pages/DashBoard/DashBoardPage";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import SocialFeedPage from "../pages/SocialFeedPage/SocialFeedPage";
import ProfileSocial from "../../../Frontend/src/pages/ProfileSocial/ProfileSocial";
import SearchPage from "../../../Frontend/src/pages/SearchPage/SearchPage";
import Setting from "../pages/setting/Setting";
import Profile from "../pages/Profile/Profile";
import Address from "../pages/Address/Address";
import Favourite from "../pages/Favourite/Favourite";
import ForgetPassword from "../pages/ForgotPassword/ForgotPassword";
import ChangePassword from "../pages/ForgotPassword/ChangePassword";
import Order from "../pages/Order/Order";

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
  {
    path: "/dashboard",
    element: <DashBoardPage />,
  },
  {
    path: "/cart",
    element: (
      <MainLayout>
        <Breadcrumb />
        <Cart />
      </MainLayout>
    ),
  },
  {
    path: "/order",
    element: (
      <MainLayout className="p-0 bg-[#f5f5f5]">
        {/* <Breadcrumb /> */}
        <Order />
      </MainLayout>
    ),
  },
  {
    path: "/favourite",
    element: (
      <MainLayout>
        <Breadcrumb />
        <Favourite />
      </MainLayout>
    ),
  },
  {
    path: "/checkout",
    element: (
      <MainLayout>
        <Breadcrumb />
        <Checkout />
      </MainLayout>
    ),
  },
  {
    path: "/social",
    element: <SocialFeedPage />,
  },
  {
    path: "/social/post/:id",
    element: <SocialFeedPage />,
  },
  {
    path: "/social-profile",
    element: <ProfileSocial />,
  },
  {
    path: "/search-page",
    element: <SearchPage />,
  },
  {
    path: "/setting-page",
    element: (
      <MainLayout>
        <Setting />
      </MainLayout>
    ),
  },
  {
    path: "/profile-page",
    element: (
      <MainLayout>
        <Profile />
      </MainLayout>
    ),
  },
  {
    path: "/my-address",
    element: (
      <MainLayout>
        <Address />
      </MainLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <MainLayout>
        <ForgetPassword />
      </MainLayout>
    ),
  },
  {
    path: "/change-forgot-password",
    element: (
      <MainLayout>
        <ChangePassword />
      </MainLayout>
    ),
  },
];

const AppRoutes = () => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
