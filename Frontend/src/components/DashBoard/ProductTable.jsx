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
  const [editSize, setEditProduct] = useState(null);
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
      categoryName: "",
      parentCategoryID: {
        id: "",
      },
    },
    sizeChart: {
      id: "",
      sizeChartType: "",
    },
    formClothes: {
      id: "",
      formClothes: "",
    },
    promotion: {
      id: "",
      discount: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGetProduct = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      console.log("Token:", token);
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

  console.log("Categories:", categories);
  console.log("Sizes:", sizes);
  console.log("Form Clothes:", formClothes);
  console.log("Promotions:", promotions);

  const openEditModal = (size) => {
    setEditProduct(size.id);
    setFormData(
      size
        ? { id: size.id, sizeChartType: size.sizeChartType }
        : { id: "", sizeChartType: "" }
    );
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
        categoryName: "",
        parentCategoryID: {
          id: "",
        },
      },
      sizeChart: {
        id: "",
        sizeChartType: "",
      },
      formClothes: {
        id: "",
        formClothes: "",
      },
      promotion: {
        id: "",
        discount: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    });
    setModalAddIsOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) return;

    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/Admin/SizeChartManagement/${editSize}`,
        { sizeChartType: formData.sizeChartType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(
        products.map((size) => (size.id === formData.id ? res.data : size))
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
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:8080/Admin/SizeChartManagement",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts([...products, res.data]);
      closeAddModal();
    } catch (error) {
      console.error("Error adding size:", error);
      toast.error("Error adding size");
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

  const columns = [
    {
      name: "ID",
      selector: (row) => (row.id ? row.id : "Null"),
      sortable: true,
    },
    {
      name: "Product Code",
      selector: (row) => (row.productCode ? row.productCode : "Null"),
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => (row.productName ? row.productName : "Null"),
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => (row.price ? row.price : "Null"),
      sortable: true,
    },
    {
      name: "Color",
      selector: (row) => (row.color ? row.color : "Null"),
      sortable: true,
    },
    {
      name: "Material",
      selector: (row) => (row.material ? row.material : "Null"),
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => (row.description ? row.description : "Null"),
      sortable: true,
    },
    {
      name: "Quantity Inventory",
      selector: (row) =>
        row.quantityInventory ? row.quantityInventory : "Null",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) =>
        row.category.categoryName ? row.category.categoryName : "Null",
      sortable: true,
    },
    {
      name: "Size Chart",
      selector: (row) =>
        row.sizeChart.sizeChartType ? row.sizeChart.sizeChartType : "Null",
      sortable: true,
    },
    {
      name: "Form Clothes",
      selector: (row) =>
        row.formClothes.formClothes ? row.formClothes.formClothes : "Null",
      sortable: true,
    },
    {
      name: "Promotion",
      selector: (row) =>
        row.promotion.name ? row.promotion.name : "Null",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => openDeleteModal(row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Size Chart</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add product
        </button>
      </div>
      <DataTable columns={columns} data={products} pagination />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title="Edit Product"
        onSubmit={handleEditSubmit}
      >
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
      </ModalUpdate>

      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title="Add Product"
        onSubmit={handleAddSubmit}
      >
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
              {size.sizeChartType}
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
          value={formData.promotion}
          onChange={(e) =>
            setFormData({ ...formData, promotion: e.target.value })
          }
        >
          <option value="">Select Promotion</option>
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
