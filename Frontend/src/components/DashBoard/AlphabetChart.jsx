import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ModalDelete from "../share/ModalDelete";

const AlphabetChart = () => {
  const [alphabet, setAlphabet] = useState([]);
  const [id, setId] = useState("");
  const [sizeChartType, setSizeChartType] = useState("");
  const [alphabetSize, setAlphabetSize] = useState("");
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [alphabetSizeId, setAlphabetSizeId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetAlphabet = async () => {
    try {
      const token = getToken();
      console.log("Token:", token);
      const res = await axios.get(
        "http://localhost:8080/Admin/AlphabetSizeManagement",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlphabet(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching alphabet:", error);
    }
  };

  useEffect(() => {
    handleGetAlphabet();
  }, []);

  const openEditModal = (size) => {
    setAlphabetSizeId(size.id);
    setId(size.sizeChart.id); // Gán giá trị vào state
    setSizeChartType(size.sizeChart.sizeChartType);
    setAlphabetSize(size.alphabetSize);
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
        `http://localhost:8080/Admin/AlphabetSizeManagement/${alphabetSizeId}`,
        {
          sizeChart: { id, sizeChartType },
          alphabetSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlphabet(
        alphabet.map((item) =>
          item.id === alphabetSizeId
            ? { ...item, sizeChart: { id, sizeChartType }, alphabetSize }
            : item
        )
      );

      closeEditModal();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.log("Edit size:", alphabetSizeId.id);
      console.error("Error updating size:", error);
      toast.error("Lỗi khi cập nhật!");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/Admin/AlphabetSizeManagement",
        {
          sizeChart: { id, sizeChartType },
          alphabetSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlphabet([...alphabet, res.data]);
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
        `http://localhost:8080/Admin/AlphabetSizeManagement/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlphabet(alphabet.filter((size) => size.id !== deleteId));
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
    { name: "Alphabet ID", selector: (row) => row.id, sortable: true },
    {
      name: "Size chart ID",
      selector: (row) => row.sizeChart.id,
      sortable: true,
    },
    {
      name: "Size Chart Type",
      selector: (row) => row.sizeChart.sizeChartType,
    },
    {
      name: "Alphabet Size",
      selector: (row) => row.alphabetSize,
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
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Alphabet Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add size
        </button>
      </div>
      <DataTable columns={columns} data={alphabet} pagination />
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
          value={alphabetSizeId}
          readOnly
        />
        <input
          type="text"
          placeholder="Size chart ID"
          className="w-full p-2 border"
          value={id} // Gán giá trị từ state
          onChange={(e) => setId(e.target.value)}
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
          value={alphabetSize}
          onChange={(e) => setAlphabetSize(e.target.value)}
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
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Size chart type"
          className="w-full p-2 border mb-2"
          onChange={(e) => setSizeChartType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alphabet size"
          className="w-full p-2 border mb-2"
          onChange={(e) => setAlphabetSize(e.target.value)}
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

export default AlphabetChart;
