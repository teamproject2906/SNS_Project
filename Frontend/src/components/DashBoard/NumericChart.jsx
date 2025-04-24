import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast } from "react-toastify";
import ModalDelete from "../share/ModalDelete";

const NumericChart = () => {
  const [numeric, setNumeric] = useState([]);
  const [id, setId] = useState("");
  const [sizeChartType, setSizeChartType] = useState("");
  const [numericSize, setNumericSize] = useState("");
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [numericSizeId, setNumericSizeId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetNumeric = async () => {
    try {
      const token = getToken();
      console.log("Token:", token);
      const res = await axios.get(
        "http://localhost:8080/Admin/NumericManagement",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNumeric(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching numeric:", error);
    }
  };

  useEffect(() => {
    handleGetNumeric();
  }, []);

  const openEditModal = (size) => {
    setNumericSizeId(size.id);
    setId(size.sizeChart.id); // Gán giá trị vào state
    setSizeChartType(size.sizeChart.sizeChartType);
    setNumericSize(size.numericSize);
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setModalAddIsOpen(true);
  };

  const openDeleteModal = (id) => {
    console.log("Delete ID:", id);
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.patch(
        `http://localhost:8080/Admin/NumericManagement/${numericSizeId}`,
        {
          sizeChart: { id, sizeChartType },
          numericSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNumeric(
        numeric.map((item) =>
          item.id === numericSizeId
            ? { ...item, sizeChart: { id, sizeChartType }, numericSize }
            : item
        )
      );
      closeEditModal();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating size:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/Admin/NumericManagement",
        {
          sizeChart: { id, sizeChartType },
          numericSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNumeric([...numeric, res.data]);
      closeAddModal();
      console.log("Add size:", res.data);
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
        `http://localhost:8080/Admin/NumericManagement/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNumeric(numeric.filter((size) => size.id !== deleteId));
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
    { name: "Numeric ID", selector: (row) => row.id, sortable: true },
    {
      name: "Size chart ID",
      selector: (row) => row.sizeChart.id,
      sortable: true,
    },
    {
      name: "Numeric Size",
      selector: (row) => row.numericSize,
      sortable: true,
    },
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
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Numeric Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add size
        </button>
      </div>
      <DataTable columns={columns} data={numeric} pagination />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit size"
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          placeholder="Alphabet ID"
          className="w-full p-2 border"
          value={numericSizeId}
          readOnly
        />
        <input
          type="text"
          placeholder="Size chart ID"
          className="w-full p-2 border"
          value={id} // Gán giá trị từ state
          readOnly
        />
        <input
          type="text"
          placeholder="Size chart type"
          className="w-full p-2 border"
          value={sizeChartType}
          onChange={(e) => setSizeChartType(e.target.value)}
          readOnly
        />
        <input
          type="text"
          placeholder="Alphabet size"
          className="w-full p-2 border"
          value={numericSize}
          onChange={(e) => setNumericSize(e.target.value)}
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
          placeholder="Size chart ID"
          className="w-full p-2 border mb-2"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Size chart type"
          className="w-full p-2 border mb-2"
          value={sizeChartType}
          onChange={(e) => setSizeChartType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Numeric size"
          className="w-full p-2 border mb-2"
          value={numericSize}
          onChange={(e) => setNumericSize(e.target.value)}
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

export default NumericChart;
