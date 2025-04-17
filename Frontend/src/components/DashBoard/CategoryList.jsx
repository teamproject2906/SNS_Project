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

  const openDeactivateModal = (id) => {
    setDeactivateID(id);
    setIsDeactivateModalOpen(true);
  };

  const openActivateModal = (id) => {
    setActivateID(id);
    setIsActivateModalOpen(true);
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
      const requestData = {
        categoryName: formData.categoryName,
      };
  
      if (formData.parentCategoryID.id.trim() !== "") {
        requestData.parentCategoryID = { id: formData.parentCategoryID.id };
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
      toast.success("Thêm danh mục thành công!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Lỗi khi thêm danh mục");
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
        toast.success("Vô hiệu hóa danh mục thành công!");
      } else {
        toast.error("Không thể vô hiệu hóa danh mục");
      }
    } catch (error) {
      console.error("Error deactivating category:", error);
      toast.error("Lỗi khi vô hiệu hóa danh mục");
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
        toast.success("Kích hoạt danh mục thành công!");
      } else {
        toast.error("Không thể kích hoạt danh mục");
      }
    } catch (error) {
      console.error("Error activating category:", error);
      toast.error("Lỗi khi kích hoạt danh mục");
    } finally {
      setIsActivateModalOpen(false);
      setActivateID(null);
    }
  };

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
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Parent Category",
      selector: (row) =>
        row.parentCategoryID ? row.parentCategoryID.id : "Null",
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add Category
        </button>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.active,
            style: {
              opacity: "0.5",
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
          value={formData.parentCategoryID ? formData.parentCategoryID.id : "Null"}
          onChange={(e) =>
            setFormData({
              ...formData,
              parentCategoryID: { id: e.target.value },
            })
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
            setFormData({
              ...formData,
              parentCategoryID: { id: e.target.value },
            })
          }
        />
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