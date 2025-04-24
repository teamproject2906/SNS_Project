import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalActivate from "../share/ModalActivate";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { to } from "@react-spring/web";

Modal.setAppElement("#root");

const PromotionChart = () => {
  const [promotions, setPromotions] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editPromotion, setEditPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const parseDateForInput = (dateString) => {
    if (!dateString) return "";

    // Handle both YYYY-MM-DD and YYYY-MM-DDTHH:mm:ss formats
    const simpleDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (simpleDateRegex.test(dateString)) {
      return dateString; // Already in YYYY-MM-DD
    }

    // Extract YYYY-MM-DD from YYYY-MM-DDTHH:mm:ss
    if (dateString.includes("T")) {
      return dateString.split("T")[0]; // Get the date part
    }

    return ""; // Invalid format
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Get YYYY-MM-DD part
    const yyyymmdd = parseDateForInput(dateString);
    if (!yyyymmdd) return "";

    // Convert YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = yyyymmdd.split("-");
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
      startDate: parseDateForInput(promotion.startDate),
      endDate: parseDateForInput(promotion.endDate),
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
      toast.success("Update promotion successfully!");
      handleGetPromotion();
    } catch (error) {
      console.error("Error updating promotion:", error.response?.data.message);
      toast.error(error.response?.data.message);
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
      handleGetPromotion();
      toast.success("Add promotion successfully!");
    } catch (error) {
      console.error(
        "Error adding promotion:",
        error.response?.data.message || error
      );
      toast.error(error.response?.data.message);
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
        toast.success("Deactivate promotion successfully!");
      } else {
        toast.error("Failed to deactivate promotion");
      }
    } catch (error) {
      console.error("Error deactivating promotion:", error);
      toast.error(error.response?.data.message);
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
        toast.success("Activate promotion successfully!");
      } else {
        toast.error("Failed to activate promotion");
      }
    } catch (error) {
      console.error("Error activating promotion:", error);
      toast.error(error.response?.data.message);
    } finally {
      setIsActivateModalOpen(false);
      setActivateID(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredPromotions = promotions.filter((promotions) => {
    const promotionName = promotions.name
      ? `${promotions.name}`.toLowerCase()
      : "";
    const id = promotions.id ? promotions.id.toString().toLowerCase() : "";

    return promotionName.includes(searchTerm) || id.includes(searchTerm);
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
      cell: (row) => (
        <>
          <div style={{ opacity: row.active ? 1 : 0.5 }}>{row.id}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Promotion Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <p
          style={{
            opacity: row.active ? 1 : 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.name}
        </p>
      ),
    },
    {
      name: "Discount",
      selector: (row) => row.discount,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.discount * 100 + "%"}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      cell: (row) => (
        <p
          style={{
            opacity: row.active ? 1 : 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.description}
        </p>
      ),
    },
    {
      name: "Start Date",
      selector: (row) => row.startDate,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {formatDate(row.startDate)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.endDate,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {formatDate(row.endDate)}
        </div>
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
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Promotion Chart</h3>
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
            Add promotion
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredPromotions}
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
        title="Edit promotion"
        onSubmit={handleEditSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Promotion Name
            </label>
            <input
              type="text"
              placeholder="Promotion name"
              className="w-full p-2 border"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Discount
            </label>
            <input
              type="number"
              placeholder="Discount"
              className="w-full p-2 border"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 border"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Start Date
            </label>
            <input
              type="date"
              placeholder="Start Date"
              className="w-full p-2 border"
              value={formData.startDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              End Date
            </label>
            <input
              type="date"
              placeholder="End Date"
              className="w-full p-2 border"
              value={formData.endDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add promotion"
        onSubmit={handleAddSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Promotion Name
            </label>
            <input
              type="text"
              placeholder="Promotion name"
              className="w-full p-2 border"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Discount
            </label>
            <input
              type="number"
              placeholder="Discount"
              className="w-full p-2 border"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 border"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Start Date
            </label>
            <input
              type="date"
              placeholder="Start Date"
              className="w-full p-2 border"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              End Date
            </label>
            <input
              type="date"
              placeholder="End Date"
              className="w-full p-2 border"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
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

export default PromotionChart;
