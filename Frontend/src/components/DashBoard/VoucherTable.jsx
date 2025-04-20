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
import ModalDelete from "../share/ModalDelete";

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
  // const [deactivateID, setDeactivateID] = useState(null);
  // const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  // const [activateID, setActivateID] = useState(null);
  // const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

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
      startDate: voucher.startDate
        ? new Date(voucher.startDate).toISOString().split("T")[0]
        : "",
      endDate: voucher.endDate
        ? new Date(voucher.endDate).toISOString().split("T")[0]
        : "",
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
    console.log("Form Data:", formData);
    setModalAddIsOpen(true);
  };

  // const openDeactivateModal = (id) => {
  //   setDeactivateID(id);
  //   setIsDeactivateModalOpen(true);
  // };

  // const openActivateModal = (id) => {
  //   setActivateID(id);
  //   setIsActivateModalOpen(true);
  // };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.patch(
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
      toast.success("Cập nhật voucher thành công!");
      handleGetVouchers();
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Lỗi khi cập nhật voucher");
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

      console.log("Sending data:", formattedData);

      const res = await axios.post(
        "http://localhost:8080/api/v1/shop",
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response data:", res.data);
      setVouchers([...vouchers, res.data]);
      closeAddModal();
      toast.success("Thêm voucher thành công!");
    } catch (error) {
      console.error("Error adding voucher:", error.response?.data || error);
      toast.error("Lỗi khi thêm voucher");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/voucher/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVouchers(vouchers.filter((voucher) => voucher.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
      toast.error("Lỗi khi xóa voucher");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // const confirmDeactivate = async () => {
  //   if (!deactivateID) return;

  //   try {
  //     const token = getToken();
  //     const res = await axios.delete(
  //       `http://localhost:8080/api/v1/shop/${deactivateID}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (res.data) {
  //       setVouchers(
  //         vouchers.map((voucher) =>
  //           voucher.id === deactivateID
  //             ? { ...voucher, active: false }
  //             : voucher
  //         )
  //       );
  //       toast.success("Vô hiệu hóa voucher thành công!");
  //     } else {
  //       toast.error("Không thể vô hiệu hóa voucher");
  //     }
  //   } catch (error) {
  //     console.error("Error deactivating voucher:", error);
  //     toast.error("Lỗi khi vô hiệu hóa voucher");
  //   } finally {
  //     setIsDeactivateModalOpen(false);
  //     setDeactivateID(null);
  //   }
  // };

  // const confirmActivate = async () => {
  //   if (!activateID) return;

  //   try {
  //     const token = getToken();
  //     const res = await axios.patch(
  //       `http://localhost:8080/api/v1/shop/reactive/${activateID}`,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (res.data) {
  //       setVouchers(
  //         vouchers.map((voucher) =>
  //           voucher.id === activateID ? { ...voucher, active: true } : voucher
  //         )
  //       );
  //       toast.success("Kích hoạt voucher thành công!");
  //     } else {
  //       toast.error("Không thể kích hoạt voucher");
  //     }
  //   } catch (error) {
  //     console.error("Error activating voucher:", error);
  //     toast.error("Lỗi khi kích hoạt voucher");
  //   } finally {
  //     setIsActivateModalOpen(false);
  //     setActivateID(null);
  //   }
  // };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredVoucher = vouchers.filter((vouchers) => {
    const id = vouchers.id ? vouchers.id.toString().toLowerCase() : "";
    const voucherCode = vouchers.voucherCode
      ? `${vouchers.voucherCode}`.toLowerCase()
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
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Voucher Code",
      selector: (row) => row.voucherCode,
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
          {row.voucherCode}
        </p>
      ),
    },
    {
      name: "Discount",
      selector: (row) => row.discount * 100 + "%",
      sortable: true,
    },
    {
      name: "Usage Limit",
      selector: (row) => row.usageLimit,
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
          {/* {row.active ? ( */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          {/* ) : null} */}
          {/* {row.active ? (
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
          )} */}
        </>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
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
        title="Edit Voucher"
        onSubmit={handleEditSubmit}
      >
        <label>Voucher Code:</label>
        <input
          type="text"
          placeholder="Voucher Code"
          className="w-full p-2 border"
          value={formData.voucherCode}
          onChange={(e) =>
            setFormData({ ...formData, voucherCode: e.target.value })
          }
        />
        <label>Discount:</label>
        <input
          type="number"
          placeholder="Discount"
          className="w-full p-2 border"
          value={formData.discount}
          onChange={(e) =>
            setFormData({ ...formData, discount: e.target.value })
          }
        />
        <label>Usage Limit:</label>
        <input
          type="number"
          placeholder="Usage Limit"
          className="w-full p-2 border"
          value={formData.usageLimit}
          onChange={(e) =>
            setFormData({ ...formData, usageLimit: e.target.value })
          }
        />
        <label>Start Date:</label>
        <input
          type="date"
          placeholder="Start Date"
          className="w-full p-2 border"
          value={formData.startDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <label>End Date:</label>
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
        title="Add Voucher"
        onSubmit={handleAddSubmit}
      >
        <div className="space-y-4">
          <div>
            <label>Voucher Code:</label>
            <input
              type="text"
              placeholder="Voucher Code"
              className="w-full p-2 border"
              value={formData.voucherCode}
              onChange={(e) =>
                setFormData({ ...formData, voucherCode: e.target.value })
              }
            />
          </div>
          <div>
            <label>Discount:</label>
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
          <div>
            <label>Usage Limit:</label>
            <input
              type="number"
              placeholder="Usage Limit"
              className="w-full p-2 border"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
            />
          </div>
          <div>
            <label>Start Date:</label>
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
          <div>
            <label>End Date:</label>
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
      {/* <ModalDeactivate
        isDeactivateModalOpen={isDeactivateModalOpen}
        setIsDeactivateModalOpen={setIsDeactivateModalOpen}
        confirmDeactivate={confirmDeactivate}
      />
      <ModalActivate
        isActivateModalOpen={isActivateModalOpen}
        setIsActivateModalOpen={setIsActivateModalOpen}
        confirmActivate={confirmActivate}
      /> */}
      <ModalDelete
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default VoucherTable;
