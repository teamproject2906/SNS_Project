import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaUser, FaSignInAlt, FaSearch, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Check if user is logged in from localStorage
    useEffect(() => {
        const userLoggedIn = localStorage.getItem("isLogin");
        setIsLoggedIn(userLoggedIn !== null);

        // Close dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Animation configuration for mobile menu
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

    const handleLogout = () => {
        localStorage.removeItem("isLogin");
        setIsLoggedIn(false);
        setIsDropdownOpen(false);  // Close the dropdown after logout
        // Redirect to login page after logout (optional)
        // window.location.href = '/login';
    };

    return (
        <header>
            {/* Top Bar */}
            <div className="bg-black text-white text-sm py-2">
                <div className="container mx-auto flex justify-between items-center px-4">
                    {/* Địa chỉ cửa hàng */}
                    <span className="hidden sm:block">STORE: 3A PHÙ ĐỔNG THIÊN VƯƠNG - HAI BÀ TRƯNG - HÀ NỘI</span>

                    {/* Login/Register or Avatar Dropdown */}
                    <div className="flex space-x-4">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button className="flex items-center" onClick={toggleDropdown}>
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuUNzMQDgnsk95ui5vpRRrv5CQoovkaGz3qA&s" // Replace with user avatar
                                        alt="Avatar"
                                        className="rounded-full w-8 h-8 sm:w-10 sm:h-10" // Adjust width and height for responsiveness
                                    />
                                </button>
                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div ref={dropdownRef} className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-48">
                                        <ul className="space-y-2 p-2 text-sm text-gray-700">
                                            <li>
                                                <button className="w-full text-left hover:bg-gray-100 px-2 py-1">Change Language</button>
                                            </li>
                                            <li>
                                                <button className="w-full text-left hover:bg-gray-100 px-2 py-1">Change Theme</button>
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
                                <Link to="/register" className="flex items-center hover:underline">
                                    <FaUser className="mr-1" />
                                    ĐĂNG KÍ
                                </Link>
                                <Link to="/login" className="flex items-center hover:underline">
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
                    {/* Giỏ hàng */}
                    <Link to={'/cart'} className="text-gray-800 flex items-center">
                        <FaShoppingBag size={20} />
                        <span className="ml-1 text-sm hidden sm:inline">0</span>
                    </Link>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center sm:ml-10 md:ml-20 lg:ml-40">
                        <Link to="/">
                            <img
                                src="../../../public/img/logosns.png"
                                alt="Logo"
                                className="h-20 sm:h-32"
                            />
                        </Link>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="hidden md:flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="TÌM KIẾM..."
                            className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none"
                        />
                        <button className="text-gray-500">
                            <FaSearch size={16} />
                        </button>
                    </div>

                    {/* Hamburger Menu (Mobile) */}
                    <button
                        className="text-gray-800 md:hidden"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                    >
                        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="mt-8">
                <animated.div
                    style={menuAnimation}
                    className={`absolute top-0 left-0 w-full z-10 md:relative md:top-auto md:left-auto md:w-auto md:z-auto ${isMenuOpen ? "block" : "hidden"
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
