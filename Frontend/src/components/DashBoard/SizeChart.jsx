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
  const [searchTerm, setSearchTerm] = useState("");

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

    if (!formData.sizeChartType || !formData.value) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (
      formData.sizeChartType === "Alphabet" &&
      !/^[a-zA-Z\s]*$/.test(formData.value)
    ) {
      toast.error("Please enter a valid alphabet!");
      return;
    }

    if (
      formData.sizeChartType === "Numeric" &&
      !/^[0-9\s]*$/.test(formData.value)
    ) {
      toast.error("Please enter a valid number!");
      return;
    }

    console.log("Edit Size:", formData);
    console.log("Edit Size ID:", editSize);

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
      toast.success("Update size successfully!");
    } catch (error) {
      console.error("Error updating size:", error);
      toast.error("Error updating size");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sizeChartType || !formData.value) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (
      formData.sizeChartType === "Alphabet" &&
      !/^[a-zA-Z\s]*$/.test(formData.value)
    ) {
      toast.error("Please enter a valid alphabet!");
      return;
    }

    if (
      formData.sizeChartType === "Numeric" &&
      !/^[0-9\s]*$/.test(formData.value)
    ) {
      toast.error("Please enter a valid number!");
      return;
    }

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
      toast.success("Add size successfully!");
      handleGetSizes();
      closeAddModal();
    } catch (error) {
      // console.error("Error adding size:", error.response?.data?.message || error);
      toast.error(error.response?.data?.message || error);
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredSizes = sizes.filter((sizes) => {
    const id = sizes.id ? sizes.id.toString().toLowerCase() : "";
    const sizeValue = sizes.value ? `${sizes.value}`.toLowerCase() : "";
    return id.includes(searchTerm) || sizeValue.includes(searchTerm);
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
        <div style={{ opacity: row.active ? 1 : 0.5 }}>{row.id}</div>
      ),
      sortable: true,
    },
    {
      name: "Size Type",
      selector: (row) => row.sizeChartType,
      cell: (row) => (
        <>
          <div style={{ opacity: row.active ? 1 : 0.5 }}>
            {row.sizeChartType}
          </div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Value",
      cell: (row) => (
        <>
          <div style={{ opacity: row.active ? 1 : 0.5 }}>{row.value}</div>
        </>
      ),
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
            Add size
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredSizes}
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.active, // Nếu user bị ban (active === false)
            style: {
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
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Size Chart Type
            </label>
            {/* <input
              type="text"
              placeholder="Size chart type"
              className="w-full p-2 border"
              value={formData.sizeChartType}
              onChange={(e) =>
                setFormData({ ...formData, sizeChartType: e.target.value })
              }
            /> */}
            <select
              className="w-full p-2 border"
              value={formData.sizeChartType}
              onChange={(e) =>
                setFormData({ ...formData, sizeChartType: e.target.value })
              }
            >
              <option value="">Select size chart type</option>
              <option value="Alphabet">Alphabet</option>
              <option value="Numeric">Numeric</option>
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Value
            </label>
            <input
              type="text"
              placeholder="Value"
              className="w-full p-2 border"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
            />
          </div>
        </div>
      </ModalUpdate>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add size"
        onSubmit={handleAddSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Size Chart Type
            </label>
            <select
              className="w-full p-2 border"
              value={formData.sizeChartType}
              onChange={(e) =>
                setFormData({ ...formData, sizeChartType: e.target.value })
              }
            >
              <option value="">Select size chart type</option>
              <option value="Alphabet">ALPHABET</option>
              <option value="Numeric">NUMERIC</option>
            </select>
            {/* <input
              type="text"
              placeholder="Size chart type"
              className="w-full p-2 border"
              value={formData.sizeChartType}
              onChange={(e) =>
                setFormData({ ...formData, sizeChartType: e.target.value })
              }
            /> */}
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Value
            </label>
            <input
              type="text"
              placeholder="Value"
              className="w-full p-2 border"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
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

export default SizeChart;
