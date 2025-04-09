import { useEffect } from "react";
import Modal from "react-modal";
// import PropTypes from "prop-types";

// Add PropTypes validation
// ModalUpload.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   title: PropTypes.string.isRequired,
//   isOpen: PropTypes.bool.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   onDelete: PropTypes.func.isRequired,
//   productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//     .isRequired,
//   productImages: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       imageUrl: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

const ModalUpload = ({
  isOpen,
  onClose,
  title,
  productImages,
  onDelete,
  onSubmit,
  productId,
}) => {
  const handleFileChange = (e) => {
    onSubmit(e, productId);
  };

  useEffect(() => {}, [productImages]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 mt-[5%] bg-white rounded-lg shadow-lg max-w-5xl mx-auto max-h-[80vh] overflow-auto"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {/* Display list of images */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {productImages && productImages.length > 0 ? (
          productImages.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt="product"
              style={{ width: "200px", height: "200px" }} // Adjusted size
              className="w-full h-auto rounded shadow"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete All
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          style={{ display: "none" }}
          id="file-upload"
          data-product-id={productId}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Image
        </label>
      </div>
    </Modal>
  );
};

export default ModalUpload;
