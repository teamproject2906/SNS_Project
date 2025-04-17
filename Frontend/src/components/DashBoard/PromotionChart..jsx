import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalActivate from "../share/ModalActivate";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";

Modal.setAppElement("#root");

const PromotionChart = () => {
  const [promotions, setPromotions] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editPromotion, setEditPromotion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [deactivateID, setDeactivateID] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [activateID, setActivateID] = useState(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleGetPromotion = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching promotion:", error);
    }
  };

  useEffect(() => {
    handleGetPromotion();
  }, []);

  const openEditModal = (promotion) => {
    setEditPromotion(promotion.id);
    setFormData({
      id: promotion.id,
      name: promotion.name || "",
      discount: promotion.discount || "",
      description: promotion.description || "",
      startDate: promotion.startDate
        ? new Date(promotion.startDate).toISOString().split("T")[0]
        : "",
      endDate: promotion.endDate
        ? new Date(promotion.endDate).toISOString().split("T")[0]
        : "",
    });
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      discount: "",
      description: "",
      startDate: "",
      endDate: "",
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
      await axios.patch(
        `http://localhost:8080/api/promotions/${editPromotion}`,
        {
          ...formData,
          startDate: formData.startDate
            ? new Date(formData.startDate).toISOString()
            : null,
          endDate: formData.endDate
            ? new Date(formData.endDate).toISOString()
            : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeEditModal();
      toast.success("Cập nhật thành công!");
      handleGetPromotion();
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast.error("Error updating promotion");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
        endDate: formData.endDate ? `${formData.endDate}T00:00:00` : null,
      };

      console.log("Sending data:", formattedData);

      const res = await axios.post(
        "http://localhost:8080/api/promotions",
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPromotions([...promotions, res.data]);
      closeAddModal();
      toast.success("Thêm thành công!");
    } catch (error) {
      console.error("Error adding promotion:", error.response?.data || error);
      toast.error("Error adding promotion");
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateID) return;

    try {
      const token = getToken();
      const res = await axios.delete(
        `http://localhost:8080/api/promotions/${deactivateID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        setPromotions(
          promotions.map((promotion) =>
            promotion.id === deactivateID
              ? { ...promotion, active: false }
              : promotion
          )
        );
        toast.success("Vô hiệu hóa khuyến mãi thành công!");
      } else {
        toast.error("Không thể vô hiệu hóa khuyến mãi");
      }
    } catch (error) {
      console.error("Error deactivating promotion:", error);
      toast.error("Lỗi khi vô hiệu hóa khuyến mãi");
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
        `http://localhost:8080/api/promotions/reactive/${activateID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        setPromotions(
          promotions.map((promotion) =>
            promotion.id === activateID
              ? { ...promotion, active: true }
              : promotion
          )
        );
        toast.success("Kích hoạt khuyến mãi thành công!");
      } else {
        toast.error("Không thể kích hoạt khuyến mãi");
      }
    } catch (error) {
      console.error("Error activating promotion:", error);
      toast.error("Lỗi khi kích hoạt khuyến mãi");
    } finally {
      setIsActivateModalOpen(false);
      setActivateID(null);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Promotion Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Discount",
      selector: (row) => row.discount * 100 + "%",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => formatDate(row.startDate),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => formatDate(row.endDate),
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
        <h3 className="text-lg font-semibold">Promotion Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add promotion
        </button>
      </div>
      <DataTable
        columns={columns}
        data={promotions}
        pagination
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
        title="Edit promotion"
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          placeholder="Promotion name"
          className="w-full p-2 border"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Discount"
          className="w-full p-2 border"
          value={formData.discount}
          onChange={(e) =>
            setFormData({ ...formData, discount: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Start Date"
          className="w-full p-2 border"
          value={formData.startDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="End Date"
          className="w-full p-2 border"
          value={formData.endDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add promotion"
        onSubmit={handleAddSubmit}
      >
        <input
          type="text"
          placeholder="Promotion name"
          className="w-full p-2 border"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Discount"
          className="w-full p-2 border"
          value={formData.discount}
          onChange={(e) =>
            setFormData({ ...formData, discount: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Start Date"
          className="w-full p-2 border"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="End Date"
          className="w-full p-2 border"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
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

export default PromotionChart;