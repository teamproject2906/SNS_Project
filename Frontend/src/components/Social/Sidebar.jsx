import { FaPlus, FaSearch, FaUser, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CreatePostPopup from "../Popup/CreatePostPopup";
import SearchPopup from "../Popup/SearchPopup";
import { useState } from "react";

const Sidebar = ({ onPostCreated }) => {
  const navigate = useNavigate();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="w-16 flex flex-col items-center justify-start p-4 h-100 space-y-6 ">
      <button className="text-2xl" onClick={() => navigate("/social")}>
        <FaHome /> {/* Search */}
      </button>
      <button className="text-2xl" onClick={() => setIsSearchOpen(true)}>
        <FaSearch /> {/* Search */}
      </button>
      <button className="text-2xl" onClick={() => navigate("/social-profile")}>
        <FaUser /> {/* Profile */}
      </button>
      <button className="text-2xl" onClick={() => setIsCreatePostOpen(true)}>
        <FaPlus /> {/* Add Post Button */}
      </button>
      <CreatePostPopup
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={onPostCreated}
      />
      {/* Search Popup */}
      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPostSelect={(post) => {
          navigate(`/social/post/${post.id}`);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  onPostCreated: PropTypes.func,
};
