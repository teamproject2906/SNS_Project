import { useEffect, useState } from "react";
import Modal from "react-modal";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalActivate from "../share/ModalActivate";

Modal.setAppElement("#root");

const VoucherTable = () => {
  const [vouchers, setVouchers] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    voucherCode: "",
    startDate: "",
    endDate: "",
    discount: "",
    usageLimit: "",
  });
  const [deactivateID, setDeactivateID] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [activateID, setActivateID] = useState(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [deleteId, setDeleteId] = useState(null);

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

  const handleGetVouchers = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/v1/shop", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVouchers(res.data);
      console.log("Vouchers:", res.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    handleGetVouchers();
  }, []);

  const openEditModal = (voucher) => {
    setEditVoucher(voucher.id);
    setFormData({
      id: voucher.id,
      voucherCode: voucher.voucherCode || "",
      discount: voucher.discount || "",
      usageLimit: voucher.usageLimit || "",
      startDate: parseDateForInput(voucher.startDate),
      endDate: parseDateForInput(voucher.endDate),
    });
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      voucherCode: "",
      startDate: "",
      endDate: "",
      discount: "",
      usageLimit: "",
    });
    setModalAddIsOpen(true);
  };

  const openDeactivateModal = (id) => {
    setDeactivateID(id);
    setIsDeactivateModalOpen(true);
  };

  // const openActivateModal = (id) => {
  //   setActivateID(id);
  //   setIsActivateModalOpen(true);
  // };

  // const openDeleteModal = (id) => {
  //   setDeleteId(id);
  //   setIsDeleteModalOpen(true);
  // };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/v1/shop/${editVoucher}`,
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
      toast.success("Update voucher successfully!");
      handleGetVouchers();
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error(error.response?.data.message);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const token = getToken();
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
        endDate: formData.endDate ? `${formData.endDate}T00:00:00` : null,
      };

      const res = await axios.post(
        "http://localhost:8080/api/v1/shop",
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVouchers([...vouchers, res.data]);
      closeAddModal();
      toast.success("Add voucher successfully!");
      handleGetVouchers();
    } catch (error) {
      console.error("Error adding voucher:", error.response?.data || error);
      toast.error(error.response?.data.message);
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateID) return;

    console.log("deactivateID", deactivateID);

    try {
      const token = getToken();
      console.log("Đã tới token", token);
      const res = await axios.delete(
        `http://localhost:8080/api/v1/shop/${deactivateID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Vouchers after deactivation:", res.data);
      setVouchers(
        vouchers.map((voucher) =>
          voucher.id === deactivateID
            ? { ...voucher, isActive: false }
            : voucher
        )
      );
      toast.success("Deactivate voucher successfully!");
    } catch (error) {
      console.error("Error deactivating voucher:", error);
      toast.error(
        error.response?.data?.message || "Error deactivating voucher"
      );
    } finally {
      setIsDeactivateModalOpen(false);
      setDeactivateID(null);
    }
  };

  // const confirmActivate = async () => {
  //   if (!activateID) return;

  //   console.log("activateID", activateID);

  //   try {
  //     const token = getToken();
  //     const res = await axios.delete(
  //       `http://localhost:8080/api/v1/shop/${activateID}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setVouchers(
  //       vouchers.map((voucher) =>
  //         voucher.id === activateID ? { ...voucher, isActive: true } : voucher
  //       )
  //     );
  //     toast.success("Kích hoạt voucher thành công!");
  //   } catch (error) {
  //     console.error("Error activating voucher:", error);
  //     toast.error("Lỗi khi kích hoạt voucher");
  //   } finally {
  //     setIsActivateModalOpen(false);
  //     setActivateID(null);
  //   }
  // };

  // const confirmDelete = async () => {
  //   if (!deleteId) return;

  //   try {
  //     const token = getToken();
  //     await axios.delete(`http://localhost:8080/api/voucher/${deleteId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setVouchers(vouchers.filter((voucher) => voucher.id !== deleteId));
  //     toast.success("Xóa thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi xóa voucher:", error);
  //     toast.error("Lỗi khi xóa voucher");
  //   } finally {
  //     setIsDeleteModalOpen(false);
  //     setDeleteId(null);
  //   }
  // };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredVoucher = vouchers.filter((voucher) => {
    const id = voucher.id ? voucher.id.toString().toLowerCase() : "";
    const voucherCode = voucher.voucherCode
      ? `${voucher.voucherCode}`.toLowerCase()
      : "";
    return id.includes(searchTerm) || voucherCode.includes(searchTerm);
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
        <div style={{ opacity: row.isActive ? 1 : 0.5 }}>{row.id}</div>
      ),
    },
    {
      name: "Voucher Code",
      selector: (row) => row.voucherCode,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            opacity: row.isActive ? 1 : 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.voucherCode}
        </div>
      ),
    },
    {
      name: "Discount",
      selector: (row) => row.discount * 100 + "%",
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.isActive ? 1 : 0.5 }}>
          {row.discount * 100 + "%"}
        </div>
      ),
    },
    {
      name: "Usage Limit",
      selector: (row) => row.usageLimit,
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.isActive ? 1 : 0.5 }}>{row.usageLimit}</div>
      ),
    },
    {
      name: "Start Date",
      selector: (row) => formatDate(row.startDate),
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.isActive ? 1 : 0.5 }}>
          {formatDate(row.startDate)}
        </div>
      ),
    },
    {
      name: "End Date",
      selector: (row) => formatDate(row.endDate),
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.isActive ? 1 : 0.5 }}>
          {formatDate(row.endDate)}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => openEditModal(row)}
            disabled={!row.isActive}
            style={{ opacity: row.isActive ? 1 : 0.5 }}
          >
            Edit
          </button>
          {row.isActive ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => openDeactivateModal(row.id)}
            >
              Deactivate
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Voucher Table</h3>
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
            Add Voucher
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredVoucher}
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.isActive,
            style: {
              backgroundColor: "#e1e1e1",
            },
          },
        ]}
      />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Voucher"
        onSubmit={handleEditSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Code:
            </label>
            <input
              type="text"
              placeholder="Voucher Code"
              className="w-full p-2 border rounded-lg"
              value={formData.voucherCode}
              onChange={(e) =>
                setFormData({ ...formData, voucherCode: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount:
            </label>
            <input
              type="number"
              placeholder="Discount"
              className="w-full p-2 border rounded-lg"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit:
            </label>
            <input
              type="number"
              placeholder="Usage Limit"
              className="w-full p-2 border rounded-lg"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date:
            </label>
            <input
              type="date"
              placeholder="Start Date"
              className="w-full p-2 border rounded-lg"
              value={formData.startDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date:
            </label>
            <input
              type="date"
              placeholder="End Date"
              className="w-full p-2 border rounded-lg"
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
        title="Add Voucher"
        onSubmit={handleAddSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Code:
            </label>
            <input
              type="text"
              placeholder="Voucher Code"
              className="w-full p-2 border rounded-lg"
              value={formData.voucherCode}
              onChange={(e) =>
                setFormData({ ...formData, voucherCode: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount:
            </label>
            <input
              type="number"
              placeholder="Discount"
              className="w-full p-2 border rounded-lg"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit:
            </label>
            <input
              type="number"
              placeholder="Usage Limit"
              className="w-full p-2 border rounded-lg"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date:
            </label>
            <input
              type="date"
              placeholder="Start Date"
              className="w-full p-2 border rounded-lg"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date:
            </label>
            <input
              type="date"
              placeholder="End Date"
              className="w-full p-2 border rounded-lg"
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
      {/* <ModalActivate
        isActivateModalOpen={isActivateModalOpen}
        setIsActivateModalOpen={setIsActivateModalOpen}
        confirmActivate={confirmActivate}
      /> */}
    </div>
  );
};

export default VoucherTable;
