import Modal from "react-modal";

const ModalActivate = ({
  isActivateModalOpen,
  setIsActivateModalOpen,
  confirmActivate,
}) => {
  return (
    <Modal
      isOpen={isActivateModalOpen}
      onRequestClose={() => setIsActivateModalOpen(false)}
      className="p-6 mt-[5%] bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2>Are you sure you want to activate?</h2>
      <div className="flex justify-end mt-10">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setIsActivateModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={confirmActivate}
        >
          Activate
        </button>
      </div>
    </Modal>
  );
};

export default ModalActivate;
