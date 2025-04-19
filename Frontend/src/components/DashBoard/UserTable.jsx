import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { getToken } from "../../pages/Login/app/static";
import { toast } from "react-toastify";
import ModalBan from "../share/ModalBan";
import ModalUnban from "../share/ModalUnban";
import ModalDetail from "../share/ModalDetail";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [banId, setBanId] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [UnbanId, setUnbanId] = useState(null);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openDetailModal = (id) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setUserId(user.id);
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dob: user.dob || "",
        gender: user.gender || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
      setModalDetailIsOpen(true);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/User/getAllUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = res.data.filter((user) => user.role !== "ADMIN");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSetRole = async (id, role) => {
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/User/setUserRole/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u.id === id ? res.data : u)));
      toast.success("Cập nhật vai trò thành công!");
    } catch (error) {
      console.error("Lỗi khi set role:", error);
      toast.error("Lỗi khi set role");
    }
  };

  const openBanModal = (id) => {
    setBanId(id);
    setIsBanModalOpen(true);
  };

  const openUnbanModal = (id) => {
    setUnbanId(id);
    setIsUnbanModalOpen(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const id = user.id.toString().toLowerCase();
    return fullName.includes(searchTerm) || id.includes(searchTerm);
  });

  const handleBan = async () => {
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/User/banUser/${banId}`,
        { active: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u.id === banId ? res.data : u)));
      toast.success("Ban user thành công!");
    } catch (error) {
      console.error("Lỗi khi ban user:", error);
      toast.error("Lỗi khi ban user");
    } finally {
      setIsBanModalOpen(false);
      setBanId(null);
    }
  };

  const handleUnban = async () => {
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/User/banUser/${UnbanId}`,
        { active: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u.id === UnbanId ? res.data : u)));
      toast.success("Unban user thành công!");
    } catch (error) {
      console.error("Lỗi khi unban user:", error);
      toast.error("Lỗi khi unban user");
    } finally {
      setIsUnbanModalOpen(false);
      setUnbanId(null);
    }
  };

  const customStyles = {
    cells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        padding: "8px",
      },
    },
    headCells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        padding: "8px",
        fontSize: "14px",
      },
    },
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>{row.id}</div>
      ),
    },
    {
      name: "Full Name",
      selector: (row) =>
        row.firstname && row.lastname
          ? `${row.firstname} ${row.lastname}`
          : "Not updated",
      sortable: true,
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.firstname && row.lastname
            ? `${row.firstname} ${row.lastname}`
            : "Not updated"}
        </div>
      ),
      style: {
        width: "100px",
        whiteSpace: "nowrap",
        padding: "8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Email",
      selector: (row) => (row.email ? row.email : "Not updated"),
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.email ? row.email : "Not updated"}
        </div>
      ),
      style: {
        width: "100px",
        whiteSpace: "nowrap",
        padding: "8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Phone",
      selector: (row) => (row.phoneNumber ? row.phoneNumber : "Not updated"),
      cell: (row) => (
        <div style={{ opacity: row.active ? 1 : 0.5 }}>
          {row.phoneNumber ? row.phoneNumber : "Not updated"}
        </div>
      ),
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        padding: "8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => {
        let bgColorClass = "";
        switch (row.role) {
          case "CUSTOMER":
            bgColorClass = "bg-blue-600 text-white";
            break;
          case "STAFF":
            bgColorClass = "bg-green-600 text-white";
            break;
          case "MODERATOR":
            bgColorClass = "bg-yellow-300 text-black";
            break;
          default:
            bgColorClass = "bg-blue-600 text-white";
        }

        return (
          <div style={{ opacity: row.active ? 1 : 0.5 }}>
            <select
              className={`w-full p-2 border rounded-lg ${bgColorClass}`}
              value={row.role}
              disabled={!row.active}
              onChange={(e) => {
                const newRole = e.target.value;
                setFormData({ ...formData, role: newRole });
                setUserId(row.id);
                handleSetRole(row.id, newRole);
              }}
            >
              <option value="CUSTOMER" className="bg-blue-600">
                USER
              </option>
              <option value="STAFF" className="bg-green-600">
                STAFF
              </option>
              <option value="MODERATOR" className="bg-yellow-300">
                MODERATOR
              </option>
            </select>
          </div>
        );
      },
    },
    {
      name: "Active",
      selector: (row) => row.active,
      sortable: true,
      cell: (row) => (
        <div className="banBtn">
          {row.active ? (
            <button
              className="bg-green-500 text-white px-3 py-2 rounded-lg mr-2"
              onClick={() => openBanModal(row.id)}
            >
              Ban
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-3 py-2 rounded-lg mr-2"
              onClick={() => openUnbanModal(row.id)}
            >
              Unban
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="banBtn">
          <button
            className="bg-green-500 text-white px-3 py-2 rounded-lg mr-2"
            onClick={() => openDetailModal(row.id)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Users</h3>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-lg"
            onChange={handleSearch}
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.active,
            style: {
              backgroundColor: "#e1e1e1", // Màu nền để dễ nhận diện
            },
          },
        ]}
      />

      <ModalBan
        isBanModalOpen={isBanModalOpen}
        setIsBanModalOpen={setIsBanModalOpen}
        confirmBan={handleBan}
      />

      <ModalUnban
        isUnbanModalOpen={isUnbanModalOpen}
        setIsUnbanModalOpen={setIsUnbanModalOpen}
        confirmUnban={handleUnban}
      />

      <ModalDetail
        isOpen={modalDetailIsOpen}
        onClose={() => setModalDetailIsOpen(false)}
        title={"User Detail"}
      >
        <div className="first_name_form">
          <label>First name:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.firstname ? formData.firstname : "Not updated"}
            readOnly
          />
        </div>
        <div className="last_name_form pt-4">
          <label>Last name:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.lastname ? formData.lastname : "Not updated"}
            readOnly
          />
        </div>
        <div className="email_form pt-4">
          <label>Email:</label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg"
            value={formData.email ? formData.email : "Not updated"}
            readOnly
          />
        </div>
        <div className="phone_number_form pt-4">
          <label>Phone number:</label>
          <input
            type="tel"
            pattern="^0(3[2-9]|5[2-9]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$"
            className="w-full p-2 border rounded-lg"
            title="Số điện thoại phải có 10 chữ số và bắt đầu bằng 03, 05, 07, 08, 09"
            value={formData.phoneNumber ? formData.phoneNumber : "Not updated"}
            readOnly
          />
        </div>
        <div className="dob_form pt-4">
          <label>Date of birth:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.dob ? formData.dob.split("T")[0] : "Not updated"}
            readOnly
          />
        </div>
        <div className="gender_male_form pt-4">
          <label className="w-4/12">Gender:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.gender ? "Male" : "Female"}
            readOnly
          />
        </div>
        <div className="bio_form pt-4">
          <label>Bio:</label>
          <textarea
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.bio ? formData.bio : "Not updated"}
            readOnly
          />
        </div>

        {formData.avatar ? (
          <div className="avatar_form pt-4 flex flex-col">
            <label>Avatar:</label>
            <div className="flex justify-center items-center">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-full p-2 border rounded-lg"
                style={{ maxWidth: "200px", maxHeight: "400px" }}
              />
            </div>
          </div>
        ) : (
          <div className="avatar_form pt-4">
            <label>Avatar:</label>
            <p className="w-full p-2 border rounded-lg">Not updated</p>
          </div>
        )}
      </ModalDetail>
    </div>
  );
};

export default UserTable;