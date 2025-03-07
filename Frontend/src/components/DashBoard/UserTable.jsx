import { useState } from "react";
import DataTable from "react-data-table-component";
import ModalUpdate from "../share/ModalUpdate";
import ModalAdd from "../share/ModalAdd";


const UserTable = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ]);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [addUser, setAddUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const openEditModal = (user = null) => {
    setEditUser(user);
    setFormData(user ? { name: user.name, email: user.email } : { name: "", email: "" });
    setModalEditIsOpen(true);
  };

  const openAddModal = (user = null) => {
    setAddUser(user);
    setFormData(user ? { name: user.name, email: user.email } : { name: "", email: "" });
    setModalAddIsOpen(true);
  };

  const closeEditModal = () => setModalEditIsOpen(false);

  const closeAddModal = () => setModalAddIsOpen(false);

  const handleEditSubmit = () => {
    if (editUser) {
      setUsers(users.map(u => (u.id === editUser.id ? { ...editUser, ...formData } : u)));
    } else {
      setUsers([...users, { id: users.length + 1, ...formData }]);
    }
    closeEditModal();
  };

  const handleAddSubmit = () => {
    if (addUser) {
      setUsers(users.map(u => (u.id === addUser.id ? { ...addUser, ...formData } : u)));
    } else {
      setUsers([...users, { id: users.length + 1, ...formData }]);
    }
    closeAddModal();
  };

  const handleDelete = (id) => {
    setUsers(users.filter((product) => product.id !== id));
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => openEditModal(row)}>
            Edit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(row.id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Users</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => openAddModal(null)}>
          Add User
        </button>
      </div>
      <DataTable columns={columns} data={users} pagination />

      <ModalUpdate isOpen={modalEditIsOpen} onClose={closeEditModal} title={editUser ? "Edit User" : "Add User"} onSubmit={handleEditSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          className="w-full p-2 border mb-2" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </ModalUpdate>

      <ModalAdd isOpen={modalAddIsOpen} onClose={closeAddModal} title={addUser ? "Edit User" : "Add User"} onSubmit={handleAddSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          className="w-full p-2 border mb-2" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </ModalAdd>
    </div>
  );
};

export default UserTable;
