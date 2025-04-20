import Modal from "react-modal";

const ModalDeactivate = ({
  isDeactivateModalOpen,
  setIsDeactivateModalOpen,
  confirmDeactivate,
}) => {
  return (
    <Modal
      isOpen={isDeactivateModalOpen}
      onRequestClose={() => setIsDeactivateModalOpen(false)}
      className="p-6 mt-[5%] bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2>Are you sure you want to deactivate?</h2>
      <div className="flex justify-end mt-10">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setIsDeactivateModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={confirmDeactivate}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ModalDeactivate;
