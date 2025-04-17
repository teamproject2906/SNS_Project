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

const FormClothesChart = () => {
  const [formClothes, setFormClothes] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editFormClothes, setEditFormClothes] = useState(null);
  const [formData, setFormData] = useState({ formClothes: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetFormClothes = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/api/formclothes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormClothes(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching formClothes:", error);
    }
  };

  useEffect(() => {
    handleGetFormClothes();
  }, []);

  const openEditModal = (form) => {
    setEditFormClothes(form.id);
    setFormData(
      form
        ? { id: form.id, formClothes: form.formClothes }
        : { id: "", formClothes: "" }
    );
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({ formClothes: "" });
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
        `http://localhost:8080/api/formclothes/${editFormClothes}`,
        { formClothes: formData.formClothes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFormClothes(
        formClothes.map((form) => (form.id === formData.id ? res.data : form))
      );
      closeEditModal();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Error updating form");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/api/formclothes",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormClothes([...formClothes, res.data]);
      closeAddModal();
    } catch (error) {
      console.error("Error adding form:", error);
      toast.error("Error adding form");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/api/formclothes/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormClothes(formClothes.filter((form) => form.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa form:", error);
      toast.error("Lỗi khi xóa form");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
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
    { name: "Form Type", selector: (row) => row.formClothes, sortable: true },
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
        <h3 className="text-lg font-semibold">Form Clothes Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add form
        </button>
      </div>
      <DataTable columns={columns} data={formClothes} pagination customStyles={customStyles} />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Form"
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          placeholder="Form chart type"
          className="w-full p-2 border"
          value={formData.formClothes}
          onChange={(e) =>
            setFormData({ ...formData, formClothes: e.target.value })
          }
        />
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add form"
        onSubmit={handleAddSubmit}
      >
        <input
          type="text"
          placeholder="Form chart type"
          className="w-full p-2 border"
          value={formData.formClothes}
          onChange={(e) =>
            setFormData({ ...formData, formClothes: e.target.value })
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

export default FormClothesChart;
