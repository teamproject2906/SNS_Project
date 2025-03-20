import React from "react";
import { FaEnvelope, FaPhone, FaBirthdayCake, FaTransgender, FaUserShield, FaInfoCircle, FaEdit } from "react-icons/fa";

const Profile = () => {
  const user = {
    avatar: "https://www.rainforest-alliance.org/wp-content/uploads/2021/06/capybara-square-1.jpg.optimal.jpg",
    firstname: "Nguyễn",
    lastname: "Văn A",
    username: "nguyenvana",
    email: "nguyenvana@example.com",
    phoneNumber: "0123456789",
    gender: 1, // 1 = Nam, 0 = Nữ
    dob: "1998-05-22",
    role: "Admin",
    bio: "Lập trình viên yêu thích React và Tailwind CSS!",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-3xl w-full bg-white p-10 rounded-lg border shadow-md">
        {/* Header */}
        <div className="flex items-center space-x-6 border-b border-black pb-6 mb-6">
          {/* Avatar */}
          <img
            className="w-28 h-28 rounded-full object-cover border-2 border-black"
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
          />
          <div>
            <h2 className="text-3xl font-light text-black uppercase tracking-wide">{user.firstname} {user.lastname}</h2>
            <p className="text-md font-medium text-black">@{user.username}</p>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="space-y-5">
          <ProfileField icon={<FaEnvelope />} label="Email" value={user.email} />
          <ProfileField icon={<FaPhone />} label="Số điện thoại" value={user.phoneNumber} />
          <ProfileField icon={<FaTransgender />} label="Giới tính" value={user.gender ? "Nam" : "Nữ"} />
          <ProfileField icon={<FaBirthdayCake />} label="Ngày sinh" value={user.dob} />
          <ProfileField icon={<FaUserShield />} label="Vai trò" value={user.role} />
          <ProfileField icon={<FaInfoCircle />} label="Mô tả" value={user.bio} />
        </div>

        {/* Button chỉnh sửa */}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center space-x-2 bg-black text-white px-5 py-2 rounded-md text-lg font-medium hover:opacity-80 transition">
            <FaEdit />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị từng dòng thông tin với icon
const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 border-b border-black pb-3 last:border-b-0">
    <div className="text-black text-lg">{icon}</div>
    <div className="flex-1">
      <span className="text-lg font-medium text-black">{label}</span>
      <p className="text-xl font-light text-black">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

export default Profile;
