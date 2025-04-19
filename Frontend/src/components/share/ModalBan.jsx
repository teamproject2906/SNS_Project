import Modal from "react-modal";

const ModalBan = ({
  isBanModalOpen,
  setIsBanModalOpen,
  confirmBan,
}) => {
  return (
    <Modal
      isOpen={isBanModalOpen}
      onRequestClose={() => setIsBanModalOpen(false)}
      className="p-6 mt-[5%] bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2>Are you sure you want to ban this account?</h2>
      <div className="flex justify-end mt-10">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setIsBanModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={confirmBan}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ModalBan;
