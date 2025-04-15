import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalActivate from "../share/ModalActivate";

Modal.setAppElement("#root");

const SizeChart = () => {
  const [sizes, setSizes] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editSize, setEditSize] = useState(null);
  const [formData, setFormData] = useState({ sizeChartType: "", value: "" });
  const [deactivateID, setDeactivateID] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [activateID, setActivateID] = useState(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const handleGetSizes = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/Admin/SizeChartManagement",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSizes(res.data);
      console.log("Sizes:", res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    handleGetSizes();
  }, []);

  const openEditModal = (size) => {
    setEditSize(size.id);
    setFormData(
      size
        ? { id: size.id, sizeChartType: size.sizeChartType, value: size.value }
        : { id: "", sizeChartType: "", value: "" }
    );
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({ sizeChartType: "", value: "" });
    setModalAddIsOpen(true);
  };

  const openDeactivateModal = (id) => {
    setDeactivateID(id);
    setIsDeactivateModalOpen(true);
  };

  const openActivateModal = (id) => {
    setActivateID(id);
    console.log("Activate ID:", id);
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
        `http://localhost:8080/Admin/SizeChartManagement/${editSize}`,
        { sizeChartType: formData.sizeChartType, value: formData.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSizes(
        sizes.map((size) => (size.id === formData.id ? res.data : size))
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
      setSizes([...sizes, res.data]);
      handleGetSizes();
      closeAddModal();
    } catch (error) {
      console.error("Error adding size:", error);
      toast.error("Error adding size");
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateID) return;

    try {
      const token = getToken();
      // Gọi API để hủy kích hoạt mà không cần truyền active
      const res = await axios.delete(
        `http://localhost:8080/Admin/SizeChartManagement/${deactivateID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật lại danh sách sizes sau khi hủy kích hoạt
      if (res.data) {
        setSizes(
          sizes.map((size) =>
            size.id === deactivateID ? { ...size, active: false } : size
          )
        );
        toast.success("Deactivate success!");
      } else {
        toast.error("Failed to deactivate size");
      }
    } catch (error) {
      console.error("Error deactivate size:", error);
      toast.error("Error deactivate size");
    } finally {
      setIsDeactivateModalOpen(false);
      setDeactivateID(null);
    }
  };

  const confirmActivate = async () => {
    if (!activateID) return;

    try {
      const token = getToken();
      // Gọi API để kích hoạt lại mà không cần truyền active
      const res = await axios.patch(
        `http://localhost:8080/Admin/SizeChartManagement/reactive/${activateID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật lại danh sách sizes sau khi kích hoạt lại
      if (res.data) {
        setSizes(
          sizes.map((size) =>
            size.id === activateID ? { ...size, active: true } : size
          )
        );
        toast.success("Activate success!");
      } else {
        toast.error("Failed to activate size");
      }
    } catch (error) {
      console.error("Error activate size:", error);
      toast.error("Error activate size");
    } finally {
      setIsActivateModalOpen(false);
      setActivateID(null);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Size Type", selector: (row) => row.sizeChartType, sortable: true },
    { name: "Value", selector: (row) => row.value, sortable: true },
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
          ) : (
            ""
          )}
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
      <DataTable
        columns={columns}
        data={sizes}
        pagination
        conditionalRowStyles={[
          {
            when: (row) => !row.active, // Nếu user bị ban (active === false)
            style: {
              opacity: "0.5", // Làm mờ
              backgroundColor: "#e1e1e1", // Màu nền để dễ nhận diện
            },
          },
        ]}
      />
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
        <input
          type="text"
          placeholder="Value"
          className="w-full p-2 border"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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
        <input
          type="text"
          placeholder="Value"
          className="w-full p-2 border"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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

export default SizeChart;
