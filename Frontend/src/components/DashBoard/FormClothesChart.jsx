import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import ModalDelete from "../share/ModalDelete";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalActivate from "../share/ModalActivate";

Modal.setAppElement("#root");

const FormClothesChart = () => {
  const [formClothes, setFormClothes] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editFormClothes, setEditFormClothes] = useState(null);
  const [formData, setFormData] = useState({ formClothes: "" });
  // const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deactivateId, setDeactivateId] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [activateId, setActivateId] = useState(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetFormClothes = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/formclothes/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // const openDeleteModal = (id) => {
  //   setDeleteId(id);
  //   setIsDeleteModalOpen(true);
  // };

  const openDeactivateModal = (id) => {
    setDeactivateId(id);
    setIsDeactivateModalOpen(true);
  };

  const openActivateModal = (id) => {
    setActivateId(id);
    setIsActivateModalOpen(true);
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
      toast.success("Update form successfully!");
      handleGetFormClothes();
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error(error.response?.data?.message || "Error updating form");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.formClothes) {
      toast.error("Please fill in the form clothes field!");
      return;
    }

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
      toast.success("Add form successfully!");
      handleGetFormClothes();
    } catch (error) {
      console.error("Error adding form:", error);
      toast.error(error.response?.data?.message || "Error adding form");
    }
  };

  // const confirmDelete = async () => {
  //   if (!deleteId) return;

  //   try {
  //     const token = getToken();
  //     await axios.delete(`http://localhost:8080/api/formclothes/${deleteId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setFormClothes(formClothes.filter((form) => form.id !== deleteId));
  //     toast.success("Xóa thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi xóa form:", error);
  //     toast.error(error.response?.data?.message || "Lỗi khi xóa form");
  //   } finally {
  //     setIsDeleteModalOpen(false);
  //     setDeleteId(null);
  //   }
  // };

  const confirmDeactivate = async () => {
    if (!deactivateId) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/api/formclothes/${deactivateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormClothes(
        formClothes.map((form) =>
          form.id === deactivateId ? { ...form, active: false } : form
        )
      );
      toast.success("Deactivate successfully!");
    } catch (error) {
      console.error("Lỗi khi deactivate form:", error);
      toast.error(error.response?.data?.message || "Error deactivating form");
    } finally {
      setIsDeactivateModalOpen(false);
      setDeactivateId(null);
    }
  };

  const confirmActivate = async () => {
    if (!activateId) return;

    try {
      const token = getToken();
      await axios.patch(
        `http://localhost:8080/api/formclothes/reactive/${activateId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormClothes(
        formClothes.map((form) =>
          form.id === activateId ? { ...form, active: true } : form
        )
      );
      toast.success("Activate successfully!");
    } catch (error) {
      console.error("Lỗi khi activate form:", error);
      toast.error(error.response?.data?.message || "Error activating form");
    } finally {
      setIsActivateModalOpen(false);
      setActivateId(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredForms = formClothes.filter((forms) => {
    const formsCloth = forms.formClothes
      ? `${forms.formClothes}`.toLowerCase()
      : "";
    const id = forms.id ? forms.id.toString().toLowerCase() : "";
    return formsCloth.includes(searchTerm) || id.includes(searchTerm);
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
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.id ? row.id : "Null"}
        </div>
      ),
    },
    {
      name: "Form Type",
      selector: (row) => row.formClothes,
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.formClothes ? row.formClothes : "Null"}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => openEditModal(row)}
            disabled={!row.active}
            style={{ display: row.active ? "block" : "none" }}
          >
            Edit
          </button>
          {row.active ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => openDeactivateModal(row.id)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => openActivateModal(row.id)}
            >
              Activate
            </button>
          )}
          {/* <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => openDeleteModal(row.id)}
            style={{ opacity: row.active ? 1 : 0.5 }}
          >
            Delete
          </button> */}
        </>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Form Clothes</h3>
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
            Add form
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredForms}
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
      {/* <ModalDelete
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
      /> */}
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

export default FormClothesChart;
