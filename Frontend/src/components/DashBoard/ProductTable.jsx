import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ModalDeactivate from "../share/ModalDeactivate";
import ModalUpload from "../share/ModalUpload";
import ModalActivate from "../share/ModalActivate";
import ModalDetail from "../share/ModalDetail";

Modal.setAppElement("#root");

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [formClothes, setFormClothes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [modalUploadIsOpen, setModalUploadIsOpen] = useState(false);
  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    price: "",
    color: "",
    material: "",
    description: "",
    quantityInventory: "",
    category: { id: "", categoryName: "" },
    sizeChart: { id: "", value: "" },
    formClothes: { id: "", formClothes: "" },
    promotion: { id: "", name: "" },
    imageUrl: "",
  });
  const [deactivateId, setDeactivateId] = useState(null);
  const [activateId, setActivateId] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleGetProduct = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/products/getAll", {
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
      const res = await axios.get(
        "http://localhost:8080/api/categories/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleGetFormClothes = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8080/api/formclothes/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormClothes(res.data);
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

  const openEditModal = (product) => {
    setEditProduct(product.id);
    const category = categories.find((c) => c.id === product.category.id) || {
      id: product.category.id,
      categoryName: "",
    };
    const sizeChart = sizes.find((s) => s.id === product.sizeChart.id) || {
      id: product.sizeChart.id,
      value: "",
    };
    const formCloth = formClothes.find(
      (f) => f.id === product.formClothes.id
    ) || {
      id: product.formClothes.id,
      formClothes: "",
    };
    const promotion = product.promotion
      ? promotions.find((p) => p.id === product.promotion.id) || {
          id: product.promotion.id,
          name: "",
        }
      : { id: "", name: "" };

    setFormData({
      productCode: product.productCode,
      productName: product.productName,
      price: product.price,
      color: product.color,
      material: product.material,
      description: product.description,
      quantityInventory: product.quantityInventory,
      category,
      sizeChart,
      formClothes: formCloth,
      promotion,
      imageUrl: product.imageUrl ? product.imageUrl : "",
    });
    setModalEditIsOpen(true);
  };

  const openDetailModal = (product) => {
    const category = categories.find((c) => c.id === product.category.id) || {
      id: product.category.id,
      categoryName: "N/A",
    };
    const sizeChart = sizes.find((s) => s.id === product.sizeChart.id) || {
      id: product.sizeChart.id,
      value: "N/A",
    };
    const formCloth = formClothes.find(
      (f) => f.id === product.formClothes.id
    ) || {
      id: product.formClothes.id,
      formClothes: "N/A",
    };
    const promotion = product.promotion
      ? promotions.find((p) => p.id === product.promotion.id) || {
          id: product.promotion.id,
          name: "N/A",
        }
      : { id: "", name: "None" };

    setFormData({
      productCode: product.productCode || "N/A",
      productName: product.productName || "N/A",
      price: product.price ? formatPrice(product.price) : "N/A",
      color: product.color || "N/A",
      material: product.material || "N/A",
      description: product.description || "N/A",
      quantityInventory: product.quantityInventory || "N/A",
      category,
      sizeChart,
      formClothes: formCloth,
      promotion,
      imageUrl: product.imageUrl || "",
    });
    setModalDetailIsOpen(true);
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
      category: { id: "", categoryName: "" },
      sizeChart: { id: "", value: "" },
      formClothes: { id: "", formClothes: "" },
      promotion: { id: "", name: "" },
      imageUrl: "",
    });
    setModalAddIsOpen(true);
  };

  const openUploadModal = async (product) => {
    const id = product.id;
    setProductId(id);
    setFormData({
      ...formData,
      imageUrl: product.imageUrl || "",
    });

    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:8080/api/product-gallery/getImageByProductId/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductImages(res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Error fetching images");
    }

    setModalUploadIsOpen(true);
  };

  const openDeactivateModal = (id) => {
    setDeactivateId(id);
    setIsDeactivateModalOpen(true);
  };

  const openActivateModal = (id) => {
    setActivateId(id);
    setIsActivateModalOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);
  const closeUploadModal = () => setModalUploadIsOpen(false);
  const closeDetailModal = () => setModalDetailIsOpen(false); // Fixed to close the detail modal

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) {
      toast.error("No product selected for editing!");
      return;
    }

    if (
      !formData.productCode ||
      !formData.productName ||
      !formData.price ||
      !formData.color ||
      !formData.material ||
      !formData.description ||
      !formData.quantityInventory ||
      !formData.category.id ||
      !formData.sizeChart.id ||
      !formData.formClothes.id
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const productData = {
      productCode: formData.productCode,
      productName: formData.productName,
      price: Number(formData.price),
      color: formData.color,
      material: formData.material,
      description: formData.description,
      quantityInventory: Number(formData.quantityInventory),
      category: { id: formData.category.id },
      sizeChart: { id: formData.sizeChart.id },
      formClothes: { id: formData.formClothes.id },
      promotion: formData.promotion.id ? { id: formData.promotion.id } : null,
    };

    try {
      const token = getToken();
      if (!token) {
        toast.error("Authentication token is missing!");
        return;
      }
      const res = await axios.patch(
        `http://localhost:8080/api/products/${editProduct}`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(
        products.map((product) =>
          product.id === editProduct ? { ...product, ...res.data } : product
        )
      );
      closeEditModal();
      handleGetProduct();
      toast.success("Update product successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productCode ||
      !formData.productName ||
      !formData.price ||
      !formData.color ||
      !formData.material ||
      !formData.description ||
      !formData.quantityInventory ||
      !formData.category.id ||
      !formData.sizeChart.id ||
      !formData.formClothes.id
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const productData = {
      productCode: formData.productCode,
      productName: formData.productName,
      price: Number(formData.price),
      color: formData.color,
      material: formData.material,
      description: formData.description,
      quantityInventory: Number(formData.quantityInventory),
      category: { id: formData.category.id },
      sizeChart: { id: formData.sizeChart.id },
      formClothes: { id: formData.formClothes.id },
      promotion: formData.promotion.id ? { id: formData.promotion.id } : null,
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
      setProducts([...products, res.data]);
      closeAddModal();
      handleGetProduct();
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateId) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/products/${deactivateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(
        products.map((product) =>
          product.id === deactivateId ? { ...product, active: false } : product
        )
      );
      toast.success("Deactivate successfully!");
    } catch (error) {
      console.error("Error deactivating product:", error);
      toast.error("Error deactivating product");
    } finally {
      setIsDeactivateModalOpen(false);
      setDeactivateId(null);
    }
  };

  const confirmActivate = async () => {
    if (!activateId) return;

    try {
      const token = getToken();
      await axios.patch(
        `http://localhost:8080/api/products/reactive/${activateId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(
        products.map((product) =>
          product.id === activateId ? { ...product, active: true } : product
        )
      );
      toast.success("Activate successfully!");
    } catch (error) {
      console.error("Error activating product:", error);
      toast.error("Error activating product");
    } finally {
      setIsActivateModalOpen(false);
      setActivateId(null);
    }
  };

  const handleUploadImage = async (e, productId) => {
    const files = e.target.files;
    const totalImagesAfterUpload = productImages.length + files.length;

    if (files.length === 0) {
      toast.error("No image selected!");
      e.target.value = null;
      return;
    }

    if (!productId) {
      toast.error("No product selected!");
      e.target.value = null;
      return;
    }

    if (productImages.length >= 10) {
      toast.error("Maximum limit of 10 images reached!");
      e.target.value = null;
      return;
    }

    if (totalImagesAfterUpload > 10) {
      toast.error(`Cannot upload. Total images would exceed 10`);
      e.target.value = null;
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxFileSize = 1 * 1024 * 1024;
    for (let i = 0; i < files.length; i++) {
      if (!allowedTypes.includes(files[i].type)) {
        toast.error(
          `File ${files[i].name} has an unsupported format! Only JPEG, PNG, JPG and WEBP are allowed.`
        );
        e.target.value = null;
        return;
      }
      if (files[i].size > maxFileSize) {
        toast.error(`File ${files[i].name} exceeds 1MB limit!`);
        e.target.value = null;
        return;
      }
    }

    const formDataUpload = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append("files", files[i]);
    }
    formDataUpload.append("productId", productId);

    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.post(
        `http://localhost:8080/api/product-gallery/upload-multiple`,
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Images uploaded successfully!");
      handleGetProduct();
      setProductImages([...productImages, ...res.data]);
      e.target.value = null;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "");
        return;
      } else {
        console.error("Error uploading images:", error);
        toast.error(
          "Error uploading images! " + (error.response?.data?.message || "")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllImages = async () => {
    try {
      const token = getToken();
      setLoading(true);
      await axios.delete(
        `http://localhost:8080/api/product-gallery/product/delete/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("All images deleted successfully!");
      setProductImages([]);
    } catch (error) {
      console.error("Error deleting images:", error);
      toast.error("No image to delete!");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    cells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        padding: "1px",
      },
    },
    headCells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        padding: "1px",
        fontSize: "14px",
      },
    },
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredProduct = products.filter((product) => {
    const productName = product.productName
      ? `${product.productName}`.toLowerCase()
      : "";
    const id = product.id ? product.id.toString().toLowerCase() : "";
    const productCode = product.productCode
      ? `${product.productCode}`.toLowerCase()
      : "";
    return (
      productName.includes(searchTerm) ||
      id.includes(searchTerm) ||
      productCode.includes(searchTerm)
    );
  });

  const colorMap = {
    Red: "red",
    "Red-Orange": "#e75113",
    Orange: "orange",
    "Yellow-Orange": "#f59e0b",
    Yellow: "yellow",
    "Yellow-Green": "#a3e635",
    Green: "green",
    Cyan: "cyan",
    Blue: "blue",
    "Blue-Purple": "#4f46e5",
    Purple: "purple",
    "Red-Purple": "#d946ef",
    White: "white",
    Black: "black",
    "": "white",
  };

  const textColorMap = {
    Red: "white",
    "Red-Orange": "white",
    Orange: "white",
    "Yellow-Orange": "black",
    Yellow: "black",
    "Yellow-Green": "black",
    Green: "white",
    Cyan: "white",
    Blue: "white",
    "Blue-Purple": "white",
    Purple: "white",
    "Red-Purple": "white",
    White: "black",
    Black: "white",
    "": "black",
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => (row.id ? row.id : "Null"),
      sortable: true,
      style: { width: "100px" },
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.id ? row.id : "Null"}
        </div>
      ),
    },
    {
      name: "Product Code",
      selector: (row) => (row.productCode ? row.productCode : "Null"),
      sortable: true,
      style: {
        width: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      cell: (row) => (
        <div
          style={{
            opacity: row.active ? 1 : 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.productCode ? row.productCode : "Null"}
        </div>
      ),
    },
    {
      name: "Product Name",
      selector: (row) => (row.productName ? row.productName : "Null"),
      sortable: true,
      style: { width: "100px" },
      cell: (row) => (
        <div
          style={{
            opacity: row.active ? 1 : 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {row.productName ? row.productName : "Null"}
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => (row.price ? formatPrice(row.price) : "Null"),
      sortable: true,
      style: {
        width: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.price ? formatPrice(row.price) : "Null"}
        </div>
      ),
    },
    {
      name: "Color",
      selector: (row) => (row.color ? row.color : "Null"),
      style: { width: "100px" },
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.color ? row.color : "Null"}
        </div>
      ),
    },
    {
      name: "Quantity",
      selector: (row) =>
        row.quantityInventory ? row.quantityInventory : "Null",
      sortable: true,
      style: { width: "100px" },
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.quantityInventory ? row.quantityInventory : "Null"}
        </div>
      ),
    },
    {
      name: "Size",
      selector: (row) => (row.sizeChart.value ? row.sizeChart.value : "Null"),
      style: { width: "100px" },
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.sizeChart.value ? row.sizeChart.value : "Null"}
        </div>
      ),
    },
    {
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          <button
            className="bg-blue-500 text-white px-2 py-2 rounded mr-2"
            onClick={() => openUploadModal(row)}
            disabled={!row.active}
          >
            Upload
          </button>
          <button
            className="bg-green-500 text-white px-2 py-2 rounded"
            onClick={() => openDetailModal(row)}
            // Removed disabled to allow viewing inactive products
          >
            View
          </button>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="bg-green-500 text-white px-2 py-2 rounded mr-2"
            onClick={() => openEditModal(row)}
            disabled={!row.active}
            style={{ opacity: row.active ? 1 : 0.5 }}
          >
            Edit
          </button>
          {row.active ? (
            <button
              className="bg-red-500 text-white px-2 py-2 rounded"
              onClick={() => openDeactivateModal(row.id)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-2 py-2 rounded"
              onClick={() => openActivateModal(row.id)}
            >
              Activate
            </button>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Product Chart</h3>
        <div className="flex flex-row gap-5">
          <div className="searchBar">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-lg"
              onChange={handleSearch}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={openAddModal}
          >
            Add product
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredProduct}
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.active,
            style: { backgroundColor: "#e1e1e1" },
          },
        ]}
      />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Product"
        onSubmit={handleEditSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Product Code
            </label>
            <input
              type="text"
              placeholder="Enter Product Code"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.productCode}
              onChange={(e) =>
                setFormData({ ...formData, productCode: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter Product Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Color
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              style={{
                backgroundColor: colorMap[formData.color] || "white",
                color: textColorMap[formData.color] || "black",
              }}
            >
              <option value="" className="bg-white text-black">
                Select Color
              </option>
              <option value="Red" className="bg-red-500 text-white">
                Red
              </option>
              <option value="Red-Orange" className="bg-orange-600 text-white">
                Red-Orange
              </option>
              <option value="Orange" className="bg-orange-500 text-white">
                Orange
              </option>
              <option value="Yellow-Orange" className="bg-amber-400 text-black">
                Yellow-Orange
              </option>
              <option value="Yellow" className="bg-yellow-500 text-black">
                Yellow
              </option>
              <option value="Yellow-Green" className="bg-lime-400 text-black">
                Yellow-Green
              </option>
              <option value="Green" className="bg-green-500 text-white">
                Green
              </option>
              <option value="Blue" className="bg-blue-500 text-white">
                Blue
              </option>
              <option value="Blue-Purple" className="bg-indigo-500 text-white">
                Blue-Purple
              </option>
              <option value="Purple" className="bg-purple-500 text-white">
                Purple
              </option>
              <option value="Red-Purple" className="bg-fuchsia-500 text-white">
                Red-Purple
              </option>
              <option value="White" className="bg-white text-black">
                White
              </option>
              <option value="Black" className="bg-black text-white">
                Black
              </option>
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Material
            </label>
            <input
              type="text"
              placeholder="Enter Material"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Description
            </label>
            <textarea
              placeholder="Enter Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y min-h-[100px] ml-1"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Quantity Inventory
            </label>
            <input
              type="number"
              placeholder="Enter Quantity Inventory"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.quantityInventory}
              onChange={(e) =>
                setFormData({ ...formData, quantityInventory: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Category
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.category.id}
              onChange={(e) => {
                const selectedCategory = categories.find(
                  (cate) => cate.id === e.target.value
                ) || { id: e.target.value, categoryName: "" };
                setFormData({
                  ...formData,
                  category: selectedCategory,
                });
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Size Chart
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.sizeChart.id}
              onChange={(e) => {
                const selectedSize = sizes.find(
                  (size) => size.id === e.target.value
                ) || { id: e.target.value, value: "" };
                setFormData({
                  ...formData,
                  sizeChart: selectedSize,
                });
              }}
            >
              <option value="">Select Size Chart</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.value}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Form Clothes
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.formClothes.id}
              onChange={(e) => {
                const selectedForm = formClothes.find(
                  (form) => form.id === e.target.value
                ) || { id: e.target.value, formClothes: "" };
                setFormData({
                  ...formData,
                  formClothes: selectedForm,
                });
              }}
            >
              <option value="">Select Form Clothes</option>
              {formClothes.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.formClothes}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Promotion
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.promotion.id}
              onChange={(e) => {
                const selectedPromo = promotions.find(
                  (promo) => promo.id === e.target.value
                ) || { id: e.target.value, name: "" };
                setFormData({
                  ...formData,
                  promotion: selectedPromo,
                });
              }}
            >
              <option value="">Select Promotion</option>
              {promotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalUpdate>
      <ModalDetail
        isOpen={modalDetailIsOpen}
        onClose={closeDetailModal}
        title="Product Detail"
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Product Code
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.productCode || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Product Name
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.productName || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Price
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.price || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Color
            </label>
            <p
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1"
              style={{
                backgroundColor: colorMap[formData.color] || "white",
                color: textColorMap[formData.color] || "black",
              }}
            >
              {formData.color || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Material
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.material || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Description
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1 min-h-[100px]">
              {formData.description || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Quantity
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.quantityInventory || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Category
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.category.categoryName || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Size Chart
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.sizeChart.value || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Form Clothes
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.formClothes.formClothes || "N/A"}
            </p>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Promotion
            </label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 ml-1">
              {formData.promotion.name || "None"}
            </p>
          </div>
        </div>
      </ModalDetail>
      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add Product"
        onSubmit={handleAddSubmit}
      >
        <div className="space-y-4">
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Product Code
            </label>
            <input
              type="text"
              placeholder="Enter Product Code"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.productCode}
              onChange={(e) =>
                setFormData({ ...formData, productCode: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter Product Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Color
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              style={{
                backgroundColor: colorMap[formData.color] || "white",
                color: textColorMap[formData.color] || "black",
              }}
            >
              <option value="" className="bg-white text-black">
                Select Color
              </option>
              <option value="Red" className="bg-red-500 text-white">
                Red
              </option>
              <option value="Red-Orange" className="bg-orange-600 text-white">
                Red-Orange
              </option>
              <option value="Orange" className="bg-orange-500 text-white">
                Orange
              </option>
              <option value="Yellow-Orange" className="bg-amber-400 text-black">
                Yellow-Orange
              </option>
              <option value="Yellow" className="bg-yellow-500 text-black">
                Yellow
              </option>
              <option value="Yellow-Green" className="bg-lime-400 text-black">
                Yellow-Green
              </option>
              <option value="Green" className="bg-green-500 text-white">
                Green
              </option>
              <option value="Blue" className="bg-blue-500 text-white">
                Blue
              </option>
              <option value="Blue-Purple" className="bg-indigo-500 text-white">
                Blue-Purple
              </option>
              <option value="Purple" className="bg-purple-500 text-white">
                Purple
              </option>
              <option value="Red-Purple" className="bg-fuchsia-500 text-white">
                Red-Purple
              </option>
              <option value="White" className="bg-white text-black">
                White
              </option>
              <option value="Black" className="bg-black text-white">
                Black
              </option>
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Material
            </label>
            <input
              type="text"
              placeholder="Enter Material"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Description
            </label>
            <textarea
              placeholder="Enter Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y min-h-[100px] ml-1"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Quantity Inventory
            </label>
            <input
              type="number"
              placeholder="Enter Quantity Inventory"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.quantityInventory}
              onChange={(e) =>
                setFormData({ ...formData, quantityInventory: e.target.value })
              }
            />
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Category
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.category.id}
              onChange={(e) => {
                const selectedCategory = categories.find(
                  (cate) => cate.id === e.target.value
                ) || { id: e.target.value, categoryName: "" };
                setFormData({
                  ...formData,
                  category: selectedCategory,
                });
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Size Chart
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.sizeChart.id}
              onChange={(e) => {
                const selectedSize = sizes.find(
                  (size) => size.id === e.target.value
                ) || { id: e.target.value, value: "" };
                setFormData({
                  ...formData,
                  sizeChart: selectedSize,
                });
              }}
            >
              <option value="">Select Size Chart</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.value}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Form Clothes
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.formClothes.id}
              onChange={(e) => {
                const selectedForm = formClothes.find(
                  (form) => form.id === e.target.value
                ) || { id: e.target.value, formClothes: "" };
                setFormData({
                  ...formData,
                  formClothes: selectedForm,
                });
              }}
            >
              <option value="">Select Form Clothes</option>
              {formClothes.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.formClothes}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Promotion
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ml-1"
              value={formData.promotion.id}
              onChange={(e) => {
                const selectedPromo = promotions.find(
                  (promo) => promo.id === e.target.value
                ) || { id: e.target.value, name: "" };
                setFormData({
                  ...formData,
                  promotion: selectedPromo,
                });
              }}
            >
              <option value="">Select Promotion</option>
              {promotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalAdd>
      <ModalUpload
        isOpen={modalUploadIsOpen}
        onClose={closeUploadModal}
        title="Upload Image"
        productImages={productImages}
        onSubmit={(e) => handleUploadImage(e, productId)}
        productId={productId}
        onDelete={handleDeleteAllImages}
        description={
          "Maximum limit of 10 images, each image size < 1MB, format: .jpg, .jpeg, .png, .webp"
        }
        loading={loading}
      />
      <ModalDeactivate
        isDeactivateModalOpen={isDeactivateModalOpen}
        setIsDeactivateModalOpen={setIsDeactivateModalOpen}
        confirmDeactivate={confirmDeactivate}
      />
      <ModalActivate
        isActivateModalOpen={isActivateModalOpen}
        setIsActivateModalOpen={setIsActivateModalOpen}
        confirmActivate={confirmActivate}
      />
    </div>
  );
};

export default ProductTable;
