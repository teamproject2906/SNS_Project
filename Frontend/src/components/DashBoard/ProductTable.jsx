import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import ModalDelete from "../share/ModalDelete";

Modal.setAppElement("#root");

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [formClothes, setFormClothes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    price: "",
    color: "",
    material: "",
    description: "",
    quantityInventory: "",
    category: {
      id: "",
    },
    sizeChart: {
      id: "",
    },
    formClothes: {
      id: "",
    },
    promotion: {
      id: "",
    },
    imageUrl: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetProduct = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.error("Expected an array of products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleGetCategory = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleGetSizes = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/Admin/SizeChartManagement",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSizes(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleGetFormClothes = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/formclothes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormClothes(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching formClothes:", error);
    }
  };

  const handleGetPromotion = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions(res.data);
      console.log("Token:", token);
    } catch (error) {
      console.error("Error fetching promotion:", error);
    }
  };

  useEffect(() => {
    handleGetProduct();
    handleGetCategory();
    handleGetSizes();
    handleGetFormClothes();
    handleGetPromotion();
  }, []);
  console.log("Product ID set for image upload:", productId); // Debugging

  console.log("Form Data:", formData);

  const openEditModal = (product) => {
    console.log("Editing Product:", product);
    setEditProduct(product.id);
    setFormData({
      productCode: product.productCode,
      productName: product.productName,
      price: product.price,
      color: product.color,
      material: product.material,
      description: product.description,
      quantityInventory: product.quantityInventory,
      category: {
        id: product.category.id,
      },
      sizeChart: {
        id: product.sizeChart.id,
      },
      formClothes: {
        id: product.formClothes.id,
      },
      promotion: {
        id: product.promotion ? product.promotion.id : null,
      },
      imageUrl: product.imageUrl ? product.imageUrl : "",
    });
    setModalEditIsOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      productCode: "",
      productName: "",
      price: "",
      color: "",
      material: "",
      description: "",
      quantityInventory: "",
      category: {
        id: "",
      },
      sizeChart: {
        id: "",
      },
      formClothes: {
        id: "",
      },
      promotion: {
        id: "",
      },
    });
    setModalAddIsOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const setOpenUploadImage = (id) => {
    setProductId(id.id); // Set the product ID to upload image for
    console.log("Product ID for upload:", id); // Log the product ID
  };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) return;

    const productData = {
      productCode: formData.productCode,
      productName: formData.productName,
      price: formData.price,
      color: formData.color,
      material: formData.material,
      description: formData.description,
      quantityInventory: formData.quantityInventory,
      category: {
        id: formData.category, // Assuming the selected category ID is stored here
      },
      sizeChart: {
        id: formData.sizeChart, // Assuming the selected size chart ID is stored here
      },
      formClothes: {
        id: formData.formClothes, // Assuming the selected form clothes ID is stored here
      },
      promotion: formData.promotion.id ? formData.promotion : null, // Send null if no promotion is selected
      imageUrl: formData.imageUrl ? formData.imageUrl : null, // Send null if no image URL is provided
    };

    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/api/products/${editProduct}`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Updated Product:", res.data); // Kiểm tra dữ liệu sản phẩm đã cập nhật
      setProducts(
        products.map((product) =>
          product.id === editProduct ? { ...product, ...productData } : product
        )
      );
      closeEditModal();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating size:", error);
      toast.error("Error updating size");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Format the product data
    const productData = {
      productCode: formData.productCode,
      productName: formData.productName,
      price: formData.price,
      color: formData.color,
      material: formData.material,
      description: formData.description,
      quantityInventory: formData.quantityInventory,
      category: {
        id: formData.category, // Assuming the selected category ID is stored here
      },
      sizeChart: {
        id: formData.sizeChart, // Assuming the selected size chart ID is stored here
      },
      formClothes: {
        id: formData.formClothes, // Assuming the selected form clothes ID is stored here
      },
      promotion: formData.promotion.id ? formData.promotion : null, // Send null if no promotion is selected
    };

    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/api/products",
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts([...products, res.data]); // Add the newly created product to the state
      closeAddModal();
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/Admin/SizeChartManagement/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((size) => size.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa size:", error);
      toast.error("Lỗi khi xóa size");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleUploadImage = async (e) => {
    const files = e.target.files; // Get the selected files
    const productId = e.target.getAttribute("data-product-id"); // Retrieve the product ID from the data attribute

    if (files.length === 0) {
      toast.error("No image selected!"); // If no file is selected
      return;
    }

    if (!productId) {
      toast.error("No product selected!"); // If no product ID is found
      return;
    }

    console.log("Uploading for Product ID:", productId); // Log the product ID

    const formDataUpload = new FormData();
    // Append all selected files to FormData
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append("files", files[i]);
    }
    formDataUpload.append("productId", productId); // Append the productId to the FormData

    try {
      const token = getToken();
      const res = await axios.post(
        `http://localhost:8080/api/product-gallery/upload-multiple`, // API endpoint for uploading images
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Images uploaded successfully!"); // Notify user on success
      handleGetProduct(); // Reload product list to reflect image updates
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images!"); // Notify user on failure
    }
  };

  const customStyles = {
    cells: {
      style: {
        minWidth: "auto", // Đảm bảo kích thước ô phù hợp với nội dung
        whiteSpace: "nowrap", // Ngăn nội dung bị xuống dòng
        padding: "1px", // Giữ khoảng cách giữa các ô
      },
    },
    headCells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        padding: "1px",
      },
    },
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => (row.id ? row.id : "Null"),
      sortable: true,
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      name: "Product Code",
      selector: (row) => (row.productCode ? row.productCode : "Null"),
      sortable: true,
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      name: "Product Name",
      selector: (row) => (row.productName ? row.productName : "Null"),
      sortable: true,
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      name: "Price",
      selector: (row) => (row.price ? row.price : "Null"),
      sortable: true,
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      name: "Color",
      selector: (row) => (row.color ? row.color : "Null"),
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      name: "Quantity Inventory",
      selector: (row) =>
        row.quantityInventory ? row.quantityInventory : "Null",
      sortable: true,
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      name: "Size",
      selector: (row) => (row.sizeChart.value ? row.sizeChart.value : "Null"),
      sortable: true,
      style: {
        width: "100px", // Đặt độ rộng cho cột ID
      },
    },
    {
      cell: (row) => (
        <>
          <input
            type="file"
            accept="image/*"
            id={`file-upload-${row.id}`} // Ensure each input has a unique ID
            onChange={handleUploadImage} // Trigger file upload handler
            data-product-id={row.id} // Use data-* attribute to store product ID
            multiple
            style={{ display: "none" }} // Hide the original input
          />
          <label
            htmlFor={`file-upload-${row.id}`} // Ensure label corresponds to input
            className="cursor-pointer p-2 bg-blue-500 text-white rounded"
          >
            Upload Image
          </label>
        </>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="bg-green-500 text-white px-2 py-2 rounded mr-2"
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-2 rounded"
            onClick={() => openDeleteModal(row.id)}
          >
            Deactivate
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Product Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add product
        </button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        pagination
        customStyles={customStyles}
      />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Product"
        onSubmit={handleEditSubmit}
      >
        <label className="text-sm font-medium mb-2">Add Product:</label>
        <input
          type="text"
          placeholder="Product Code"
          className="w-full p-2 border"
          value={formData.productCode}
          onChange={(e) =>
            setFormData({ ...formData, productCode: { id: e.target.value } })
          }
        />
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border"
          value={formData.productName}
          onChange={(e) =>
            setFormData({ ...formData, productName: { id: e.target.value } })
          }
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: { id: e.target.value } })
          }
        />
        <input
          type="text"
          placeholder="Color"
          className="w-full p-2 border"
          value={formData.color}
          onChange={(e) =>
            setFormData({ ...formData, color: { id: e.target.value } })
          }
        />
        <input
          type="text"
          placeholder="Material"
          className="w-full p-2 border"
          value={formData.material}
          onChange={(e) =>
            setFormData({ ...formData, material: { id: e.target.value } })
          }
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: { id: e.target.value } })
          }
        ></textarea>
        <input
          type="number"
          placeholder="Quantity Inventory"
          className="w-full p-2 border"
          value={formData.quantityInventory}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantityInventory: { id: e.target.value },
            })
          }
        />
        <select
          className="w-full p-2 border"
          value={formData.category.id}
          onChange={(e) =>
            setFormData({ ...formData, category: { id: e.target.value } })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cate) => (
            <option key={cate.id} value={cate.id}>
              {cate.categoryName}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border"
          value={formData.sizeChart.id}
          onChange={(e) =>
            setFormData({ ...formData, sizeChart: { id: e.target.value } })
          }
        >
          <option value="">Select Size Chart</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.value}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border"
          value={formData.formClothes.id}
          onChange={(e) =>
            setFormData({ ...formData, formClothes: { id: e.target.value } })
          }
        >
          <option value="">Select Form Clothes</option>
          {formClothes.map((form) => (
            <option key={form.id} value={form.id}>
              {form.formClothes}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border"
          value={formData.promotion.id ? formData.promotion.id : ""} // Nếu không có `id`, chọn giá trị mặc định trống
          onChange={(e) =>
            setFormData({ ...formData, promotion: { id: e.target.value } })
          }
        >
          <option value="">Select Promotion</option> {/* Tùy chọn bỏ qua */}
          {promotions.map((promo) => (
            <option key={promo.id} value={promo.id}>
              {promo.name}
            </option>
          ))}
        </select>
      </ModalUpdate>

      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add Product"
        onSubmit={handleAddSubmit}
      >
        <label className="text-sm font-medium mb-2">Add Product:</label>
        <input
          type="text"
          placeholder="Product Code"
          className="w-full p-2 border"
          value={formData.productCode}
          onChange={(e) =>
            setFormData({ ...formData, productCode: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border"
          value={formData.productName}
          onChange={(e) =>
            setFormData({ ...formData, productName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Color"
          className="w-full p-2 border"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />
        <input
          type="text"
          placeholder="Material"
          className="w-full p-2 border"
          value={formData.material}
          onChange={(e) =>
            setFormData({ ...formData, material: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        ></textarea>
        <input
          type="number"
          placeholder="Quantity Inventory"
          className="w-full p-2 border"
          value={formData.quantityInventory}
          onChange={(e) =>
            setFormData({ ...formData, quantityInventory: e.target.value })
          }
        />
        <select
          className="w-full p-2 border"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cate) => (
            <option key={cate.id} value={cate.id}>
              {cate.categoryName}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border"
          value={formData.sizeChart}
          onChange={(e) =>
            setFormData({ ...formData, sizeChart: e.target.value })
          }
        >
          <option value="">Select Size Chart</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.value}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border"
          value={formData.formClothes}
          onChange={(e) =>
            setFormData({ ...formData, formClothes: e.target.value })
          }
        >
          <option value="">Select Form Clothes</option>
          {formClothes.map((form) => (
            <option key={form.id} value={form.id}>
              {form.formClothes}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border"
          value={formData.promotion || ""} // Nếu không có `id`, chọn giá trị mặc định trống
          onChange={(e) =>
            setFormData({ ...formData, promotion: { id: e.target.value } })
          }
        >
          <option value="">Select Promotion</option> {/* Tùy chọn bỏ qua */}
          {promotions.map((promo) => (
            <option key={promo.id} value={promo.id}>
              {promo.name}
            </option>
          ))}
        </select>
      </ModalAdd>
      <ModalDelete
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ProductTable;
