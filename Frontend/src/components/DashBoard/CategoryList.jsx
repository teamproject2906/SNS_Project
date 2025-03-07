import { useState } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";

const CategoryList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: "$1000", category: "Electronics", status: "Active" },
    { id: 2, name: "Phone", price: "$500", category: "Electronics", status: "Active" },
  ]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });

  const openEditModal = (user = null) => {
    setEditCategory(user);
    setFormData(
      user ? { name: user.name, price: user.price } : { name: "", price: "" }
    );
    setModalEditIsOpen(true);
  };

  const openAddModal = (user = null) => {
    setAddCategory(user);
    setFormData(
      user ? { name: user.name, price: user.price } : { name: "", price: "" }
    );
    setModalAddIsOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);
  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = () => {
    if (editCategory) {
      setProducts(
        products.map((u) =>
          u.id === editCategory.id ? { ...editCategory, ...formData } : u
        )
      );
    } else {
      setProducts([...products, { id: products.length + 1, ...formData }]);
    }
    closeEditModal();
  };

  const handleAddSubmit = () => {
    setProducts([...products, { id: products.length + 1, ...formData, status: "Active" }]);
    closeAddModal();
  };

  const toggleStatus = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, status: product.status === "Active" ? "Deactive" : "Active" }
          : product
      )
    );
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Product", selector: (row) => row.name, sortable: true },
    { name: "Price", selector: (row) => row.price, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          <button
            className={`px-4 py-2 rounded ${row.status === "Active" ? "bg-red-500" : "bg-gray-500"} text-white`}
            onClick={() => toggleStatus(row.id)}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Category</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => openAddModal(null)}
        >
          Add Category
        </button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        pagination
        conditionalRowStyles={[
          {
            when: (row) => row.status === "Deactive",
            style: {
              opacity: 0.5,
            },
          },
        ]}
      />
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title={editCategory ? "Edit Category" : "Add Category"}
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          className="w-full p-2 border"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </ModalUpdate>

      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title={addCategory ? "Edit Category" : "Add Category"}
        onSubmit={handleAddSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          className="w-full p-2 border"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </ModalAdd>
    </div>
  );
};

export default CategoryList;