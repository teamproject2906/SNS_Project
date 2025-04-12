import React, { useState, useEffect, useRef } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaTransgender,
  FaUserShield,
  FaInfoCircle,
  FaEdit,
  FaTimes,
  FaSave,
  FaKey,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({
    avatar: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phoneNumber: "",
    gender: 1,
    dob: "",
    role: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState(user.phoneNumber);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editedRole, setEditedRole] = useState(user.role);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "");

  // Lấy thông tin từ JWT token để xác định user
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  // Lấy thông tin user từ backend khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setError("Bạn chưa đăng nhập");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const decodedToken = parseJwt(token);
        const userId = decodedToken?.userId;

        if (!userId) {
          throw new Error("Không thể xác định thông tin người dùng");
        }

        const response = await axios.get(
          `http://localhost:8080/User/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Xử lý response và cập nhật state
        const userData = response.data;

        // Nếu có trường dob và có định dạng ISO date, cắt bỏ phần time
        const formattedDob = userData.dob ? userData.dob.split("T")[0] : "";

        setUser({
          ...userData,
          dob: formattedDob,
          // Đảm bảo các trường khác có giá trị mặc định nếu API không trả về
          avatar:
            userData.avatar ||
            "https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png",
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          username: userData.username || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          gender: userData.gender === false ? 0 : 1, // Chuyển đổi giữa boolean và số
          role: userData.role || "User",
          bio: userData.bio || "",
        });

        setEditedUser({
          ...userData,
          dob: formattedDob,
          gender: userData.gender === false ? 0 : 1,
        });

        setEditedEmail(userData.email || "");
        setEditedPhone(userData.phoneNumber || "");
        setEditedUsername(userData.username || "");
        setEditedRole(userData.role || "User");
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Không thể lấy thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Thêm hàm xử lý upload avatar
  const handleSaveAvatar = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `http://localhost:8080/User/updateAvt/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({
        ...user,
        avatar: response.data,
      });

      setIsEditingAvatar(false);
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật ảnh đại diện!");
      console.error("Lỗi:", error);
    }
  };

  // Gửi yêu cầu cập nhật API
  const handleSave = async () => {
    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }

      const updatedUser = {
        ...editedUser,
        gender: editedUser.gender === "1" || editedUser.gender === 1,
      };

      const response = await axios.put(
        `http://localhost:8080/User/update/${userId}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Chỉnh sửa thành công");

      setUser({
        ...response.data,
        avatar:
          response.data.avatar ||
          "https://www.rainforest-alliance.org/wp-content/uploads/2021/06/capybara-square-1.jpg.optimal.jpg",
        dob: response.data.dob?.split("T")[0] || "", // Chuyển thành yyyy-MM-dd
        gender: response.data.gender === false ? 0 : 1,
      });

      setIsEditing(false);
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại");
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const submitChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }

      await axios.patch(
        `http://localhost:8080/User/changePassword`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Đổi mật khẩu thành công");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error("Đổi mật khẩu thất bại!");
    }
  };

  const handleSaveEmail = async () => {
    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8080/User/changeEmail/${userId}`,
        { email: editedEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser({
        ...user,
        email: editedEmail,
      });

      setIsEditingEmail(false);
      toast.success("Chỉnh sửa email thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật email!");
      console.error("Lỗi:", error);
    }
  };

  const handleSavePhone = async () => {
    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8080/User/changePhone/${userId}`,
        { phoneNumber: editedPhone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser({
        ...user,
        phoneNumber: editedPhone,
      });

      setIsEditingPhone(false);
      toast.success("Chỉnh sửa số điện thoại thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật số điện thoại!");
      console.error("Lỗi:", error);
    }
  };

  const handleSaveUsername = async () => {
    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8080/User/updateUsername/${userId}`,
        { username: editedUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser({
        ...user,
        username: editedUsername,
      });

      setIsEditingUsername(false);
      toast.success("Chỉnh sửa tên người dùng thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật tên người dùng!");
      console.error("Lỗi:", error);
    }
  };

  const handleSaveRole = async () => {
    try {
      const decodedToken = parseJwt(token);
      const userId = decodedToken?.userId;

      if (!userId) {
        toast.error("Không thể xác định thông tin người dùng");
        return;
      }
      console.log(editedRole);
      // Giả sử API endpoint cần được thêm vào backend
      const response = await axios.patch(
        `http://localhost:8080/User/setUserRole/${userId}`,
        { role: editedRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser({
        ...user,
        role: editedRole,
      });
      console.log({
        ...user,
        role: editedRole,
      });
      setIsEditingRole(false);
      toast.success("Chỉnh sửa vai trò thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật vai trò!");
      console.error("Lỗi:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-3xl w-full bg-white p-10 rounded-lg border shadow-md">
        <ToastContainer />
        {/* Header */}
        <div className="flex justify-between space-x-6 border-b border-black pb-6 mb-6">
          <div className="flex items-center space-x-6">
            <img
              className="w-28 h-28 rounded-full object-cover border-2 border-black cursor-pointer"
              src={user.avatar}
              alt="User Avatar"
              onClick={() => setIsEditingAvatar(true)}
            />
            <div>
              <h2 className="text-3xl font-light text-black uppercase tracking-wide">
                {user.firstname} {user.lastname}
              </h2>
              <div className="flex items-center">
                <p className="text-md font-medium text-black">
                  @{user.username}
                </p>
                {/* <button
                  className="ml-2 font-bold text-lg text-blue-500 hover:text-blue-700"
                  onClick={() => setIsEditingUsername(true)}>
                  Edit
                </button> */}
              </div>
            </div>
          </div>
          <div className="inline">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2 hover:bg-red-700 transition"
            >
              <FaKey />
              <span>Đổi mật khẩu</span>
            </button>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="space-y-5">
          <div className="flex justify-between border-b border-black pb-3">
            <ProfileField
              icon={<FaEnvelope />}
              label="Email"
              value={user.email}
            />
            <button
              className="font-bold text-lg text-blue-500 hover:text-blue-700"
              onClick={() => setIsEditingEmail(true)}
            >
              Edit
            </button>
          </div>

          <div className="flex justify-between border-b border-black pb-3">
            <ProfileField
              icon={<FaPhone />}
              label="Số điện thoại"
              value={user.phoneNumber}
            />
            <button
              className="font-bold text-lg text-blue-500 hover:text-blue-700"
              onClick={() => setIsEditingPhone(true)}
            >
              Edit
            </button>
          </div>

          <ProfileField
            icon={<FaTransgender />}
            label="Giới tính"
            value={user.gender ? "Nam" : "Nữ"}
          />

          <ProfileField
            icon={<FaBirthdayCake />}
            label="Ngày sinh"
            value={user.dob}
          />

          <div className="flex justify-between border-b border-black pb-3">
            <ProfileField
              icon={<FaUserShield />}
              label="Vai trò"
              value={user.role}
            />
            <button
              className="font-bold text-lg text-blue-500 hover:text-blue-700"
              onClick={() => setIsEditingRole(true)}
            >
              Edit
            </button>
          </div>

          <ProfileField
            icon={<FaInfoCircle />}
            label="Mô tả"
            value={user.bio}
          />
        </div>

        {/* Button chỉnh sửa */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-black text-white px-5 py-2 rounded-md text-lg font-medium hover:opacity-80 transition"
          >
            <FaEdit />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Popup chỉnh sửa */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Chỉnh sửa hồ sơ</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form chỉnh sửa */}
            <div className="space-y-4 mt-4">
              <InputField
                label="Họ"
                name="firstname"
                value={editedUser.firstname}
                onChange={handleChange}
              />
              <InputField
                label="Tên"
                name="lastname"
                value={editedUser.lastname}
                onChange={handleChange}
              />
              <InputField
                label="Ngày sinh"
                name="dob"
                type="date"
                value={editedUser.dob}
                onChange={handleChange}
              />
              <InputField
                label="Giới tính"
                name="gender"
                type="select"
                value={editedUser.gender}
                onChange={handleChange}
                options={{ 1: "Nam", 0: "Nữ" }}
              />
              <InputField
                label="Mô tả"
                name="bio"
                value={editedUser.bio}
                onChange={handleChange}
              />

              {/* Nút lưu */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Change Password */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form nhập mật khẩu */}
            <div className="space-y-4 mt-4">
              <InputField
                label="Mật khẩu hiện tại"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handleChangePassword}
              />
              <InputField
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleChangePassword}
              />
              <InputField
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleChangePassword}
              />

              {/* Nút gửi */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={submitChangePassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Xác nhận</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit Email */}
      {isEditingEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Chỉnh sửa Email</h2>
              <button
                onClick={() => setIsEditingEmail(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form nhập email */}
            <div className="space-y-4 mt-4">
              <InputField
                label="Email"
                name="email"
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />

              {/* Nút lưu */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingEmail(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEmail}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit Phone */}
      {isEditingPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Chỉnh sửa Số điện thoại</h2>
              <button
                onClick={() => setIsEditingPhone(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form nhập số điện thoại */}
            <div className="space-y-4 mt-4">
              <InputField
                label="Số điện thoại"
                name="phoneNumber"
                type="tel"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
              />

              {/* Nút lưu */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingPhone(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSavePhone}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit Username */}
      {isEditingUsername && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">
                Chỉnh sửa Tên người dùng
              </h2>
              <button
                onClick={() => setIsEditingUsername(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form nhập username */}
            <div className="space-y-4 mt-4">
              <InputField
                label="Tên người dùng"
                name="username"
                type="text"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
              />

              {/* Nút lưu */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingUsername(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveUsername}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit Role */}
      {isEditingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Chỉnh sửa Vai trò</h2>
              <button
                onClick={() => setIsEditingRole(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form nhập role */}
            <div className="space-y-4 mt-4">
              <InputField
                label="Vai trò"
                name="role"
                type="select"
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value)}
                options={{
                  CUSTOMER: "USER",
                  STAFF: "STAFF",
                  MODERATOR: "MODERATOR",
                }}
              />

              {/* Nút lưu */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingRole(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveRole}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit Avatar - thêm vào cuối file trước thẻ đóng div cuối cùng */}
      {isEditingAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Thay đổi ảnh đại diện</h2>
              <button
                onClick={() => setIsEditingAvatar(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={selectedAvatar || user.avatar}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-black"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Chọn ảnh
                </button>
              </div>

              {/* Nút lưu */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsEditingAvatar(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveAvatar}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component hiển thị dòng thông tin
const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 border-b border-black pb-3 first:border-b-0 last:border-b-0">
    <div className="text-black text-lg">{icon}</div>
    <div className="flex-1">
      <span className="text-lg font-medium text-black">{label}</span>
      <p className="text-xl font-light text-black">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  </div>
);

// Component Input chung
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
}) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 w-full rounded"
      >
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 w-full rounded"
      />
    )}
  </div>
);

export default Profile;
