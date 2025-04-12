import React, { useState } from "react";
import { FaCog, FaHome, FaSearch, FaUser } from "react-icons/fa"; // Sử dụng icon tìm kiếm

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State lưu trữ từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State lưu trữ kết quả tìm kiếm

  // Hàm xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Cập nhật từ khóa tìm kiếm
    if (e.target.value.length > 0) {
      // Giả lập kết quả tìm kiếm
      setSearchResults([
        `${e.target.value} Result 1`,
        `${e.target.value} Result 2`,
        `${e.target.value} Result 3`,
      ]);
    } else {
      setSearchResults([]); // Nếu không có từ khóa, xóa kết quả tìm kiếm
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 flex flex-col items-center justify-around p-4 h-100">
        <div className="space-y-6">
          <button className="text-2xl">
            <FaHome /> {/* Home */}
          </button>
          <button className="text-2xl">
            <FaSearch /> {/* Search */}
          </button>
          <button className="text-2xl">
            <FaUser /> {/* Profile */}
          </button>
          <button className="text-2xl">
            <FaCog /> {/* Settings */}
          </button>
        </div>
        <button className="text-2xl mt-auto bg-gray-700 rounded-full p-3 hover:bg-gray-600">
          + {/* Add Post Button */}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-600" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch} // Cập nhật tìm kiếm
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="text-gray-800 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {result}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No results found</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-16 bg-gray-800 text-white flex flex-col items-center justify-center p-4">
        <button className="text-2xl">+</button> {/* Add Post Button */}
      </div>
    </div>
  );
};

export default SearchPage;
