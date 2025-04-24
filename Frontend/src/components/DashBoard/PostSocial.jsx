import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalDetail from "../share/ModalDetail";

Modal.setAppElement("#root");

const PostSocial = () => {
  const [posts, setPosts] = useState([]);
  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [deactivateId, setDeactivateId] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPosts, setViewPosts] = useState([]);

  const handleGetPosts = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/social/api/post/getAllPostActive",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else {
        console.error("Expected an array of posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(error.response?.data.message || "Failed to fetch posts");
    }
  };

  const openDetailModal = async (userId) => {
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:8080/social/api/post/getPostsByUid/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setViewPosts(res.data);
      setModalDetailIsOpen(true);
    } catch (error) {
      console.error("Error fetching posts by user ID:", error);
      toast.error(error.response?.data.message || "Failed to fetch user posts");
    }
  };

  const closeDetailModal = () => {
    setModalDetailIsOpen(false);
    setViewPosts([]);
  };

  const openDeactivateModal = (id) => {
    setDeactivateId(id);
    setIsDeactivateModalOpen(true);
  };

  const confirmDeactivate = async () => {
    if (!deactivateId) return;

    console.log("deactivateId", deactivateId);

    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/social/api/post/deactivatePost/${deactivateId}`,
        {
          active: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data) {
        handleGetPosts();
      }
      toast.success("Post deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating post:", error);
      toast.error(error.response?.data.message || "Failed to deactivate post");
    } finally {
      setIsDeactivateModalOpen(false);
      setDeactivateId(null);
    }
  };

  useEffect(() => {
    handleGetPosts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredPosts = posts.filter((post) => {
    const username = post.username ? post.username.toLowerCase() : "";
    const id = post.id ? post.id.toString().toLowerCase() : "";
    const content = post.content ? post.content.toLowerCase() : "";
    return (
      username.includes(searchTerm) ||
      id.includes(searchTerm) ||
      content.includes(searchTerm)
    );
  });

  const customStyles = {
    cells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        padding: "1px",
      },
    },
    headCells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        padding: "1px",
        fontSize: "14px",
      },
    },
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => (row.id ? row.id : "N/A"),
      sortable: true,
      style: { width: "100px" },
      cell: (row, index) => <div>{row.id ? index + 1 : "N/A"}</div>,
    },
    {
      name: "Username",
      selector: (row) => (row.username ? row.username : "N/A"),
      sortable: true,
      style: { width: "150px" },
      cell: (row) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.username ? row.username : "N/A"}
        </div>
      ),
    },
    {
      name: "Content",
      selector: (row) => (row.content ? row.content : "N/A"),
      style: { width: "200px" },
      cell: (row) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.content ? row.content : "N/A"}
        </div>
      ),
    },
    {
      name: "Total Likes",
      selector: (row) => (row.totalLiked ? row.totalLiked : 0),
      sortable: true,
      style: { width: "100px" },
      cell: (row) => <div>{row.totalLiked ? row.totalLiked : 0}</div>,
    },
    {
      name: "Total Reports",
      selector: (row) => (row.totalReported ? row.totalReported : 0),
      sortable: true,
      style: { width: "100px" },
      cell: (row) => <div>{row.totalReported ? row.totalReported : 0}</div>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="bg-green-500 text-white px-2 py-2 rounded mr-2"
            onClick={() => openDetailModal(row.userId)}
          >
            View
          </button>
          <button
            className="bg-red-500 text-white px-2 py-2 rounded"
            onClick={() => openDeactivateModal(row.id)}
          >
            Deactivate
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Post Management</h3>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-lg"
            onChange={handleSearch}
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredPosts}
        pagination
        customStyles={customStyles}
      />
      <ModalDetail
        isOpen={modalDetailIsOpen}
        onClose={closeDetailModal}
        title="User Posts"
      >
        <div className="space-y-4">
          {viewPosts.length > 0 ? (
            viewPosts.map((post, index) => (
              <div key={post.id} className="flex flex-col pb-4 gap-5">
                <div className="field-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    ID
                  </label>
                  <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
                    {index + 1 || "N/A"}
                  </p>
                </div>
                <div className="field-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Username
                  </label>
                  <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
                    {post.username || "N/A"}
                  </p>
                </div>
                <div className="field-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Content
                  </label>
                  <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1 min-h-[100px]">
                    {post.content || "N/A"}
                  </p>
                </div>
                <div className="field-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Image URL
                  </label>
                  <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      />
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div className="field-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Total Likes
                  </label>
                  <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
                    {post.totalLiked || 0}
                  </p>
                </div>
                <div className="field-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Total Reports
                  </label>
                  <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
                    {post.totalReported || 0}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No posts found for this user.</p>
          )}
        </div>
      </ModalDetail>
      <ModalDeactivate
        isDeactivateModalOpen={isDeactivateModalOpen}
        setIsDeactivateModalOpen={setIsDeactivateModalOpen}
        confirmDeactivate={confirmDeactivate}
      />
    </div>
  );
};

export default PostSocial;
