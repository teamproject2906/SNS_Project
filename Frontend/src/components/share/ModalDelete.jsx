import Modal from "react-modal";

const ModalDelete = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDelete,
}) => {
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onRequestClose={() => setIsDeleteModalOpen(false)}
      className="p-6 mt-[4%] bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2>Bạn có chắc chắn muốn xóa?</h2>
      <div className="flex justify-end mt-10">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          Hủy
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={confirmDelete}
        >
          Xóa
        </button>
      </div>
    </Modal>
  );
};

export default ModalDelete;
