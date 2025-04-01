import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
// import ModalUpdate from "../share/ModalUpdate";
// import ModalAdd from "../share/ModalAdd";
import axios from "axios";
import { getToken } from "../../pages/Login/app/static";
import { toast } from "react-toastify";
import ModalBan from "../share/ModalBan";
import ModalUnban from "../share/ModalUnban";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  // const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  // const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  // const [userId, setUserId] = useState(null);
  // const [addUser, setAddUser] = useState(null);
  const [banId, setBanId] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [UnbanId, setUnbanId] = useState(null);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);

  console.log(getToken());
  console.log("BanID", banId);
  console.log("Token", getToken());

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Xử lý trường hợp null hoặc undefined

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // const openEditModal = (user) => {
  //   setUserId(user.id);
  //   setFormData(
  //     user
  //       ? {
  //           firstname: user.firstname,
  //           lastname: user.lastname,
  //           email: user.email,
  //           phoneNumber: user.phoneNumber,
  //           dob: user.dob,
  //           gender: user.gender,
  //           bio: user.bio,
  //           avatar: user.avatar,
  //           active: user.active,
  //         }
  //       : { name: "", email: "" }
  //   );
  //   setModalEditIsOpen(true);
  // };

  // const openAddModal = (user = null) => {
  //   setAddUser(user);
  //   setFormData(
  //     user ? { name: user.name, email: user.email } : { name: "", email: "" }
  //   );
  //   setModalAddIsOpen(true);
  // };

  // const closeEditModal = () => setModalEditIsOpen(false);

  // const closeAddModal = () => setModalAddIsOpen(false);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/User/getAllUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = getToken();
  //     const dataToSend = {
  //       ...formData,
  //       active: formData.active === "true" || formData.active === true,
  //     };

  //     const res = await axios.put(
  //       `http://localhost:8080/User/update/${userId}`,
  //       dataToSend,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setUsers(users.map((user) => (user.id === userId ? res.data : user)));
  //     toast.success("Cập nhật user thành công!");
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật user:", error);
  //     toast.error("Lỗi khi cập nhật user");
  //   }
  //   closeEditModal();
  // };

  // const handleAddSubmit = () => {
  //   if (addUser) {
  //     setUsers(
  //       users.map((u) =>
  //         u.id === addUser.id ? { ...addUser, ...formData } : u
  //       )
  //     );
  //   } else {
  //     setUsers([...users, { id: users.length + 1, ...formData }]);
  //   }
  //   closeAddModal();
  // };

  // const handleDelete = (id) => {
  //   setUsers(users.filter((product) => product.id !== id));
  // };

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
        {
          active: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u.id === banId ? res.data : u)));
      toast.success("Ban user thanh cong!");
    } catch (error) {
      console.error("Loi khi ban user:", error);
      toast.error("Loi khi ban user");
    } finally {
      setIsBanModalOpen(false);
      setBanId(null); // Reset banId sau khi thực hiện hành động
    }
  };

  const handleUnban = async () => {
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:8080/User/banUser/${UnbanId}`,
        {
          active: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u.id === UnbanId ? res.data : u)));
      toast.success("Unban user thanh cong!");
    } catch (error) {
      console.error("Loi khi unban user:", error);
      toast.error("Loi khi unban user");
    } finally {
      setIsUnbanModalOpen(false);
      setUnbanId(null); // Reset banId sau khi thực hiện hành động
    }
  };

  const customStyles = {
    cells: {
      style: {
        minWidth: "auto", // Đảm bảo kích thước ô phù hợp với nội dung
        whiteSpace: "nowrap", // Ngăn nội dung bị xuống dòng
        padding: "8px", // Giữ khoảng cách giữa các ô
      },
    },
    headCells: {
      style: {
        minWidth: "auto",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        padding: "8px",
      },
    },
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Full Name",
      selector: (row) =>
        row.firstname && row.lastname
          ? `${row.firstname} ${row.lastname}`
          : "Not updated",
      sortable: true,
    },
    // { name: "Username", selector: (row) => row.username, sortable: true },
    {
      name: "Email",
      selector: (row) => (row.email ? row.email : "Not updated"),
    },
    {
      name: "Phone",
      selector: (row) => (row.phoneNumber ? row.phoneNumber : "Not updated"),
    },
    {
      name: "Date of Birth",
      selector: (row) => (row.dob ? formatDate(row.dob) : "Not updated"),
    },
    {
      name: "Gender",
      selector: (row) => (row.gender ? "Male" : "Female"),
      sortable: true,
    },
    {
      name: "Bio",
      selector: (row) => (row.bio ? row.bio : "Not updated"),
    },
    {
      name: "Avatar",
      selector: (row) =>
        row.avatar ? (
          <img width={100} height={100} src={row.avatar} />
        ) : (
          "Not updated"
        ),
    },
    {
      name: "Active",
      selector: (row) => (row.active ? "YES" : "NO"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <div className="banBtn">
            {row.active ? (
              <button
                className="bg-green-500 text-white px-3 py-2 rounded mr-2"
                onClick={() => openBanModal(row.id)}
              >
                Ban
              </button>
            ) : (
              <button
                className="bg-green-500 text-white px-3 py-2 rounded mr-2"
                onClick={() => openUnbanModal(row.id)}
              >
                Unban
              </button>
            )}
          </div>
          <div className="roleBtn">
            {row.active ? (
              <button className="bg-red-500 text-white px-3 py-2 rounded">
                Role
              </button>
            ) : (
              ""
            )}
          </div>
        </>
      ),
      // Mở comment nếu muốn disable các nút
      // cell: (row) => (
      //   <>
      //     <button
      //       className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      //       onClick={() => openBanModal(row.id)}
      //       disabled={!row.active} // Disable nếu user đã bị ban
      //       style={{ opacity: !row.active ? 0.5 : 1, cursor: !row.active ? "not-allowed" : "pointer" }}
      //     >
      //       Ban
      //     </button>
      //     <button
      //       className="bg-red-500 text-white px-4 py-2 rounded"
      //       disabled={!row.active} // Disable nếu user đã bị ban
      //       style={{ opacity: !row.active ? 0.5 : 1, cursor: !row.active ? "not-allowed" : "pointer" }}
      //     >
      //       Role
      //     </button>
      //   </>
      // ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-semibold">Users</h3>
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => openAddModal(null)}
        >
          Add User
        </button> */}
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
        data={filteredUsers} // Sử dụng danh sách đã lọc
        pagination
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row) => !row.active, // Nếu user bị ban (active === false)
            style: {
              opacity: "0.5", // Làm mờ
              backgroundColor: "#f8d7da", // Màu nền để dễ nhận diện
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

      {/* <ModalUpdate
        isOpen={modalEditIsOpen}
        onClose={closeEditModal}
        title={userId ? "Edit User" : "Add User"}
        onSubmit={handleEditSubmit}
      >
        <div className="first_name_form">
          <label>First name:</label>
          <input
            type="text"
            placeholder="First name"
            className="w-full p-2 border rounded-lg"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />
        </div>
        <div className="last_name_form pt-4">
          <label>Last name:</label>
          <input
            type="text"
            placeholder="Last name"
            className="w-full p-2 border rounded-lg"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </div>
        <div className="email_form pt-4">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="phone_number_form pt-4">
          <label>Phone number:</label>
          <input
            type="tel"
            pattern="^0(3[2-9]|5[2-9]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$"
            placeholder="Số điện thoại (VD: 0987654321)"
            className="w-full p-2 border rounded-lg"
            title="Số điện thoại phải có 10 chữ số và bắt đầu bằng 03, 05, 07, 08, 09"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: Number(e.target.value) })
            }
          />
        </div>
        <div className="dob_form pt-4">
          <label>Date of birth:</label>
          <input
            type="date"
            placeholder="Date of birth"
            className="w-full p-2 border rounded-lg"
            value={formData.dob ? formData.dob.split("T")[0] : "NULL"}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>
        <div className="gender_form_layout flex items-center flex-row pt-4">
          <label className="w-4/12">Gender:</label>
          <div className="w-8/12 gender_form_radio flex flex-row justify-around">
            <div className="gender_male_form">
              <input
                type="radio"
                id="male"
                name="gender"
                value="true"
                checked={formData.gender === true || formData.gender === "true"}
                onChange={() => setFormData({ ...formData, gender: true })}
                className="rounded-lg"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="gender_female_form">
              <input
                type="radio"
                id="female"
                name="gender"
                value="false"
                checked={
                  formData.gender === false || formData.gender === "false"
                }
                onChange={() => setFormData({ ...formData, gender: false })}
                className="rounded-lg"
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
        </div>
        <div className="bio_form pt-4">
          <label>Bio:</label>
          <input
            type="text"
            placeholder="Bio"
            className="w-full p-2 border rounded-lg"
            value={formData.bio ? formData.bio : "NULL"}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        {formData.avatar ? (
          <div className="avatarForm flex items-center flex-col pt-4">
            <input
              type="image"
              src={formData.avatar}
              style={{ width: "100px", height: "120px" }}
              placeholder="Avatar"
              className="w-full p-2 border"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
            />
            <div className="avatarForm flex items-center flex-row justify-center pt-2">
              <button className="uploadBtn bg-red-500 p-3 rounded-lg">
                Upload Image
              </button>
            </div>
          </div>
        ) : (
          <div className="avatarForm flex items-center flex-row justify-center pt-4">
            <button className="uploadBtn bg-red-500 p-3 rounded-lg">
              Upload Image
            </button>
          </div>
        )}

        <div className="active_form_layout flex items-center flex-row pt-4">
          <label className="w-4/12">Status:</label>
          <div className="w-8/12 active_form_radio flex flex-row justify-around">
            <div className="active_status_form">
              <input
                type="radio"
                id="active"
                name="active"
                value="true"
                checked={formData.active === true}
                onChange={() => setFormData({ ...formData, active: true })}
              />
              <label htmlFor="active">Active</label>
            </div>
            <div className="inactive_status_form">
              <input
                type="radio"
                id="inactive"
                name="active"
                value="false"
                checked={formData.active === false}
                onChange={() => setFormData({ ...formData, active: false })}
              />
              <label htmlFor="inactive">Inactive</label>
            </div>
          </div>
        </div>
      </ModalUpdate> */}

      {/* <ModalAdd
        isOpen={modalAddIsOpen}
        onClose={closeAddModal}
        title={addUser ? "Edit User" : "Add User"}
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
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </ModalAdd> */}
    </div>
  );
};

export default UserTable;
