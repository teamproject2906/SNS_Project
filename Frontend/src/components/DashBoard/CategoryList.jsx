import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalActivate from "../share/ModalActivate";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategoryID: {
      id: "",
    },
  });
  const [deactivateID, setDeactivateID] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [activateID, setActivateID] = useState(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/api/categories/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEditModal = (category) => {
    setEditCategory(category.id);
    setFormData({
      categoryName: category.categoryName || "",
      parentCategoryID: category.parentCategoryID
        ? { id: category.parentCategoryID.id.toString() }
        : null,
    });
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      categoryName: "",
      parentCategoryID: { id: "" },
    });
    setModalAddIsOpen(true);
  };

  const openDeactivateModal = (id) => {
    setDeactivateID(id);
    setIsDeactivateModalOpen(true);
  };

  const openActivateModal = (id) => {
    setActivateID(id);
    setIsActivateModalOpen(true);
  };

  const closeEditModal = () => {
    setModalEditIsOpen(false);
    setFormData({
      categoryName: "",
      parentCategoryID: null,
    });
    setEditCategory(null);
  };
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const parentId = formData.parentCategoryID?.id
        ? parseInt(formData.parentCategoryID.id, 10)
        : null;

      if (parentId) {
        const parentExists = categories.some(
          (cat) => cat.id === parentId && cat.active && cat.id !== editCategory
        );
        if (!parentExists) {
          toast.error("Parent category does not exist or is inactive!");
          return;
        }
      }

      const requestData = {
        categoryName: formData.categoryName,
        parentCategoryID: parentId ? { id: parentId } : null,
      };

      await axios.patch(
        `http://localhost:8080/api/categories/${editCategory}`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCategories();
      closeEditModal();
      toast.success("Update category successfully!");
    } catch (error) {
      if (error.response.status === 400) {
        console.error("Error updating category:", error.response?.data);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const requestData = {
        categoryName: formData.categoryName,
      };

      if (!formData.categoryName.trim()) {
        toast.error("Please enter a category name");
        return;
      }

      if (formData.parentCategoryID.id.trim() !== "") {
        requestData.parentCategoryID = { id: formData.parentCategoryID.id };
      } else {
        requestData.parentCategoryID = null;
      }

      const res = await axios.post(
        "http://localhost:8080/api/categories",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories([...categories, res.data]);
      closeAddModal();
      fetchCategories();
      toast.success("Add category successfully!");
    } catch (error) {
      console.error("Error adding category:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateID) return;

    try {
      const token = getToken();
      const res = await axios.delete(
        `http://localhost:8080/api/categories/${deactivateID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        setCategories(
          categories.map((cat) =>
            cat.id === deactivateID ? { ...cat, active: false } : cat
          )
        );
        toast.success("Deactivate category successfully!");
      } else {
        toast.error("Failed to deactivate category");
      }
    } catch (error) {
      console.error("Error deactivating category:", error);
      toast.error("Error deactivating category");
    } finally {
      setIsDeactivateModalOpen(false);
      setDeactivateID(null);
    }
  };

  const confirmActivate = async () => {
    if (!activateID) return;

    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/api/categories/reactive/${activateID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        setCategories(
          categories.map((cat) =>
            cat.id === activateID ? { ...cat, active: true } : cat
          )
        );
        toast.success("Activating category successfully!");
      } else {
        toast.error("Failed to activate category");
      }
    } catch (error) {
      console.error("Error activating category:", error);
      toast.error("Error activating category");
    } finally {
      setIsActivateModalOpen(false);
      setActivateID(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredCategories = categories.filter((categories) => {
    const categoryName = categories.categoryName
      ? `${categories.categoryName}`.toLowerCase()
      : "";
    const id = categories.id ? categories.id.toString().toLowerCase() : "";
    // const parentCategoryId = categories.parentCategoryID.id
    //   ? categories.parentCategoryID.id.toString().toLowerCase()
    //   : "";
    // const categoriesWithParentsId = categories.parentCategoryID.categoryName
    //   ? `${categories.parentCategoryID.categoryName}`.toLowerCase()
    //   : "";
    return (
      categoryName.includes(searchTerm) || id.includes(searchTerm)
      // categoriesWithParentsId.includes(searchTerm)
      // parentCategoryId.includes(searchTerm)
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
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>{row.id}</div>
      ),
      sortable: true,
    },
    {
      name: "Category Name",
      cell: (row) => (
        <>
          <div style={{ opacity: row.active ? 1 : 0.5 }}>
            {row.categoryName ? row.categoryName : "Null"}
          </div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Parent Category",
      cell: (row) => (
        <>
          <div style={{ opacity: row.active ? 1 : 0.5 }}>
            {row.parentCategoryID ? row.parentCategoryID.categoryName : "Null"}
          </div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {row.active ? (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => openEditModal(row)}
              style={{ opacity: row.active ? 1 : 0.5 }}
            >
              Edit
            </button>
          ) : null}
          {row.active ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => openDeactivateModal(row.id)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => openActivateModal(row.id)}
            >
              Activate
            </button>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Category List</h3>
        <div className="flex flex-row gap-5">
          <div className="searchBar">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-lg"
              onChange={handleSearch}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={openAddModal}
          >
            Add Category
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredCategories}
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.active,
            style: {
              backgroundColor: "#e1e1e1",
            },
          },
        ]}
      />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Category"
        onSubmit={handleEditSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Category Name"
              className="w-full p-2 border"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Parent Category ID
            </label>
            <select
              className="w-full p-2 border mt-2"
              value={formData.parentCategoryID?.id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentCategoryID: e.target.value
                    ? { id: e.target.value }
                    : null,
                })
              }
            >
              <option value="">No Parent Category</option>
              {categories
                .filter((cat) => cat.active && cat.id !== editCategory) // Loại bỏ danh mục đang chỉnh sửa
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName} (ID: {cat.id})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add Category"
        onSubmit={handleAddSubmit}
      >
        {/* <input
          type="text"
          placeholder="Category Name"
          className="w-full p-2 border"
          onChange={(e) =>
            setFormData({ ...formData, categoryName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Parent Category ID"
          className="w-full p-2 border mt-2"
          onChange={(e) =>
            setFormData({
              ...formData,
              parentCategoryID: { id: e.target.value },
            })
          }
        /> */}
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter Category Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Parent Category ID
            </label>
            <input
              type="text"
              placeholder="Enter Parent Category ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentCategoryID: { id: e.target.value },
                })
              }
            />
          </div>
        </div>
      </ModalAdd>
      <ModalDeactivate
        isDeactivateModalOpen={isDeactivateModalOpen}
        setIsDeactivateModalOpen={setIsDeactivateModalOpen}
        confirmDeactivate={confirmDeactivate}
      />
      <ModalActivate
        isActivateModalOpen={isActivateModalOpen}
        setIsActivateModalOpen={setIsActivateModalOpen}
        confirmActivate={confirmActivate}
      />
    </div>
  );
};

export default CategoryList;
