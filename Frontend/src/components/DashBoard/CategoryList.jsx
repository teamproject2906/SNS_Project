import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import ModalDelete from "../share/ModalDelete";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategoryID: {
      id: "",
    },
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      categoryName: category.categoryName,
      parentCategoryID: category.parentCategoryID
        ? { id: category.parentCategoryID.id }
        : { id: "" },
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

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/api/categories/${editCategory}`,
        {
          categoryName: formData.categoryName,
          parentCategoryID: formData.parentCategoryID.id
            ? formData.parentCategoryID
            : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(
        categories.map((cate) => (cate.id === editCategory ? res.data : cate))
      );
      closeEditModal();
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Lỗi khi cập nhật danh mục");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/api/categories",
        {
          categoryName: formData.categoryName,
          parentCategoryID: formData.parentCategoryID.id
            ? formData.parentCategoryID
            : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories([...categories, res.data]);
      closeAddModal();
      toast.success("Thêm danh mục thành công!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Lỗi khi thêm danh mục");
    }
  };

  const confirmDelete = async () => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/categories/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((cat) => cat.id !== deleteId));
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi khi xóa danh mục");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Parent Category",
      selector: (row) => row.parentCategoryID || "Null",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => openDeleteModal(row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Category List</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add Category
        </button>
      </div>
      <DataTable columns={columns} data={categories} pagination />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Category"
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          placeholder="Category Name"
          className="w-full p-2 border"
          value={formData.categoryName}
          onChange={(e) =>
            setFormData({ ...formData, categoryName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Parent Category ID"
          className="w-full p-2 border mt-2"
          value={formData.parentCategoryID.id || "Null"}
          onChange={(e) =>
            setFormData({ ...formData, parentCategoryID: e.target.value })
          }
        />
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add Category"
        onSubmit={handleAddSubmit}
      >
        <input
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
            setFormData({ ...formData, parentCategoryID: e.target.value })
          }
        />
      </ModalAdd>
      <ModalDelete
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default CategoryList;
