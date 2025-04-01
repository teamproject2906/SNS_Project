import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import ModalDelete from "../share/ModalDelete";

Modal.setAppElement("#root");

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editSize, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    price: "",
    color: "",
    material: "",
    description: "",
    quantityInventory: "",
    category: {
      id: "",
      categoryName: "",
      parentCategoryID: {
        id: "",
      },
    },
    sizeChart: {
      id: "",
      sizeChartType: "",
    },
    formClothes: {
      id: "",
      formClothesType: "",
    },
    promotion: {
      id: "",
      discount: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetProduct = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/Admin/SizeChartManagement",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    handleGetProduct();
  }, []);

  const openEditModal = (size) => {
    setEditProduct(size.id);
    setFormData(
      size
        ? { id: size.id, sizeChartType: size.sizeChartType }
        : { id: "", sizeChartType: "" }
    );
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({ sizeChartType: "" });
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
    if (!formData.id) return;

    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/Admin/SizeChartManagement/${editSize}`,
        { sizeChartType: formData.sizeChartType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(
        products.map((size) => (size.id === formData.id ? res.data : size))
      );
      closeEditModal();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating size:", error);
      toast.error("Error updating size");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/Admin/SizeChartManagement",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts([...products, res.data]);
      closeAddModal();
    } catch (error) {
      console.error("Error adding size:", error);
      toast.error("Error adding size");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/Admin/SizeChartManagement/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((size) => size.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa size:", error);
      toast.error("Lỗi khi xóa size");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Size Type", selector: (row) => row.sizeChartType, sortable: true },
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
        <h3 className="text-lg font-semibold">Size Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add size
        </button>
      </div>
      <DataTable columns={columns} data={products} pagination />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit size"
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          placeholder="Size chart type"
          className="w-full p-2 border"
          value={formData.sizeChartType}
          onChange={(e) =>
            setFormData({ ...formData, sizeChartType: e.target.value })
          }
        />
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add size"
        onSubmit={handleAddSubmit}
      >
        <input
          type="text"
          placeholder="Size chart type"
          className="w-full p-2 border"
          value={formData.sizeChartType}
          onChange={(e) =>
            setFormData({ ...formData, sizeChartType: e.target.value })
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

export default ProductTable;
