import Modal from "react-modal";

const ModalUpdate = ({ isOpen, onClose, title, children, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 mt-[5%] bg-white rounded-lg shadow-lg max-w-md mx-auto max-h-[80vh] border-2 border-black"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-y-auto max-h-[60vh] pr-2 pb-1">{children}</div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded-full w-full"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-full w-full"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ModalUpdate;
