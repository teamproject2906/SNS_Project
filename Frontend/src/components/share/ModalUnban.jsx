import Modal from "react-modal";

const ModalUnban = ({
  isUnbanModalOpen,
  setIsUnbanModalOpen,
  confirmUnban,
}) => {
  return (
    <Modal
      isOpen={isUnbanModalOpen}
      onRequestClose={() => setIsUnbanModalOpen(false)}
      className="p-6 mt-[5%] bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2>Bạn có chắc chắn muốn unban user này?</h2>
      <div className="flex justify-end mt-10">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setIsUnbanModalOpen(false)}
        >
          Không
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={confirmUnban}
        >
          Có
        </button>
      </div>
    </Modal>
  );
};

export default ModalUnban;
