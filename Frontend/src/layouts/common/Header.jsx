import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaUser,
  FaSignInAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHeart,
} from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { CgProfile } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import {
  removeToken,
  removeUserInfo,
  getToken,
  setToken,
  setUserInfo,
} from "../../pages/Login/app/static";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../assets/styles/Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, setUser } = useUser();
  const [product, setProduct] = useState([]); // Khởi tạo product là mảng rỗng
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setTokenState] = useState(
    localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "")
  );

  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const navigate = useNavigate();

  console.log("User:", user);
  console.log("Token:", token);

  useEffect(() => {
    console.log("User thay đổi:", user);
  }, [user]);

  const menuAnimation = useSpring({
    opacity: isMenuOpen ? 1 : 1,
    transform: isMenuOpen ? "translateY(45%)" : "translateY(-100%)",
    backgroundColor: "#fff",
    config: { tension: 300, friction: 25 },
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      document.cookie =
        "id_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        "other_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      removeToken();
      removeUserInfo();
      setTokenState(null);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  };

  useEffect(() => {
    const cookieToken = getCookie("id_token");
    console.log("Token từ cookie:", cookieToken);
    if (cookieToken) {
      setToken(cookieToken);
      setTokenState(cookieToken);
      const decoded = jwtDecode(cookieToken);
      setUser(decoded);
      setUserInfo(decoded);
    }
  }, []);

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Kiểm tra dữ liệu trả về từ API
        if (Array.isArray(res.data)) {
          setProduct(res.data); // Nếu là mảng, gán trực tiếp
        } else {
          setProduct([]); // Nếu không phải mảng, gán mảng rỗng
          console.log("Product data is not an array:", res.data);
        }
      } catch (err) {
        setError(err.message);
        setProduct([]); // Gán mảng rỗng nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchedProducts(); // Chỉ gọi API nếu có token
  }, [token]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchDropdownOpen(query.length > 0);
  };

  const filteredProducts = Array.isArray(product)
    ? product.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setError("Bạn chưa đăng nhập");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const decodedToken = parseJwt(token);
        const userId = decodedToken?.userId;
        console.log("Token decoded:", decodedToken);

        const expirationDate = new Date(decodedToken.exp * 1000);
        console.log("Thời hạn là:", expirationDate);

        if (!userId) {
          throw new Error("Không thể xác định thông tin người dùng");
        }

        const response = await axios.get(
          `http://localhost:8080/User/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const userData = response.data;
        setUser({
          ...userData,
          avatar:
            userData.avatar ||
            "https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png",
          role: userData.role || "User",
        });
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Không thể lấy thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (token) fetchUserProfile();
  }, [token]);

  return (
    <header>
      <div className="bg-black text-white text-sm py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <span className="hidden sm:block">
            STORE: 3A PHÙ ĐỔNG THIÊN VƯƠNG - HAI BÀ TRƯNG - HÀ NỘI
          </span>
          <div className="flex space-x-4">
            {user ? (
              <div className="relative">
                <button className="flex items-center" onClick={toggleDropdown}>
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-48 z-10"
                  >
                    <ul className="space-y-2 p-2 text-sm text-gray-700">
                      <li>
                        <Link
                          to={`/profile-page`}
                          className="w-full text-left hover:bg-gray-100 px-2 py-1 flex"
                        >
                          <CgProfile className="mr-3 mt-1" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/my-address`}
                          className="w-full text-left hover:bg-gray-100 px-2 py-1 flex"
                        >
                          <CiLocationOn className="mr-3 mt-1" />
                          Address
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left hover:bg-gray-100 px-2 py-1"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="inline mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center hover:underline py-2"
                >
                  <FaUser className="mr-1" />
                  ĐĂNG KÍ
                </Link>
                <Link
                  to="/login"
                  className="flex items-center hover:underline py-2"
                >
                  <FaSignInAlt className="mr-1" />
                  ĐĂNG NHẬP
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 border-b border-gray-400">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to={"/cart"} className="text-gray-800 flex items-center mx-2">
            <FaShoppingBag size={20} />
            <span className="ml-1 text-sm hidden sm:inline">0</span>
          </Link>
          <Link
            to={"/favourite"}
            className="text-gray-800 flex items-center mx-2"
          >
            <FaHeart size={20} />
            <span className="ml-1 text-sm hidden sm:inline">0</span>
          </Link>
          <div className="flex-1 flex justify-center sm:ml-10 md:ml-20 lg:ml-40">
            <Link to="/">
              <img
                src="../../../public/img/logosns.png"
                alt="Logo"
                className="h-20 sm:h-32"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2 relative">
            <input
              type="text"
              placeholder="TÌM KIẾM..."
              className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none w-64"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="text-gray-500">
              <FaSearch size={16} />
            </button>
            {isSearchDropdownOpen && (
              <div
                ref={searchDropdownRef}
                style={{ margin: 0 }}
                className="absolute top-10 left-0 w-11/12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 z-10"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <Link
                      to={`/products/${item.id}`}
                      key={item.id}
                      className="flex items-center p-2 hover:bg-gray-100 border-b border-gray-200"
                    >
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/50"}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)}đ
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-2 text-sm text-gray-500">
                    Không tìm thấy sản phẩm.
                  </p>
                )}
              </div>
            )}
          </div>
          <button
            className="text-gray-800 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <animated.div
          style={menuAnimation}
          className={`absolute top-0 left-0 w-full z-10 md:relative md:top-auto md:left-auto md:w-auto md:z-auto ${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:justify-center`}
        >
          <div className="container mx-auto px-4">
            <nav>
              <ul className="flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-4 md:space-y-0 text-sm font-semibold text-black">
                <li>
                  <Link to="/" className="hover:underline">
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/social" className="hover:underline">
                    SOCIAL
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:underline">
                    PRODUCTS
                  </Link>
                </li>
                <li>
                  <Link to="/tshirt" className="hover:underline">
                    T-SHIRT
                  </Link>
                </li>
                <li>
                  <Link to="/shirt" className="hover:underline">
                    SHIRT
                  </Link>
                </li>
                <li>
                  <Link to="/tanktop" className="hover:underline">
                    TANK TOP
                  </Link>
                </li>
                <li>
                  <Link to="/jackets" className="hover:underline">
                    JACKETS
                  </Link>
                </li>
                <li>
                  <Link to="/pants" className="hover:underline">
                    PANTS
                  </Link>
                </li>
                <li>
                  <Link to="/shorts" className="hover:underline">
                    SHORTS
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </animated.div>
      </div>
    </header>
  );
};

export default Header;
