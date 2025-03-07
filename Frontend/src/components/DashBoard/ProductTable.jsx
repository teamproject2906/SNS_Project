import { useState } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";

const ProductTable = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: "$1000" },
    { id: 2, name: "Phone", price: "$500" },
  ]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editProduct, setEditUser] = useState(null);
  const [addProduct, setAddUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });

  const openEditModal = (user = null) => {
    setEditUser(user);
    setFormData(
      user ? { name: user.name, price: user.price } : { name: "", price: "" }
    );
    setModalEditIsOpen(true);
  };

  const openAddModal = (user = null) => {
    setAddUser(user);
    setFormData(
      user ? { name: user.name, price: user.price } : { name: "", price: "" }
    );
    setModalAddIsOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);

  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = () => {
    if (editProduct) {
      setProducts(
        products.map((u) =>
          u.id === editProduct.id ? { ...editProduct, ...formData } : u
        )
      );
    } else {
      setProducts([...products, { id: products.length + 1, ...formData }]);
    }
    closeEditModal();
  };

  const handleAddSubmit = () => {
    if (addProduct) {
      setProducts(
        products.map((u) =>
          u.id === addProduct.id ? { ...addProduct, ...formData } : u
        )
      );
    } else {
      setProducts([...products, { id: products.length + 1, ...formData }]);
    }
    closeAddModal();
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Product", selector: (row) => row.name, sortable: true },
    { name: "Price", selector: (row) => row.price, sortable: true },
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
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Products</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => openAddModal(null)}
        >
          Add Product
        </button>
      </div>
      <DataTable columns={columns} data={products} pagination/>
      <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title={editProduct ? "Edit Product" : "Add Product"}
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
          type="price"
          placeholder="price"
          className="w-full p-2 border"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </ModalUpdate>

      <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title={addProduct ? "Edit Product" : "Add Product"}
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
          type="price"
          placeholder="price"
          className="w-full p-2 border"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </ModalAdd>
    </div>
  );
};

export default ProductTable;
