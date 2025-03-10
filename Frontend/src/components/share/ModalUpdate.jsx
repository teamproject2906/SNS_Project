import Modal from "react-modal";

const ModalUpdate = ({ isOpen, onClose, title, children, onSubmit }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancel
        </button>
        <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </Modal>
  );
};

export default ModalUpdate;
