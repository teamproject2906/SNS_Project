import Modal from "react-modal";

const ModalDetail = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto max-h-[80vh] overflow-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="overflow-y-auto max-h-[60vh] pr-2">{children}</div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetail;
