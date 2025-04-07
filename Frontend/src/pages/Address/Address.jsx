import { useState, useEffect } from "react";
import AddressForm from "../../components/Address/AddressForm";
import { FaEdit } from "react-icons/fa";
import { addressService } from "../../services/addressService";
import { toast } from "react-toastify";
import { getUserInfo } from "../../pages/Login/app/static";

// Component chính quản lý địa chỉ
const AddressManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      fetchAddresses(userInfo.userId);
    }
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      setLoading(true);
      const data = await addressService.getAllAddresses(userId);
      setAddresses(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError("Failed to fetch addresses");
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsNewAddress(true);
    setCurrentAddress(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAddress(null);
    setIsNewAddress(false);
  };

  const handleUpdate = (address) => {
    setCurrentAddress(address);
    setIsNewAddress(false);
    setIsModalOpen(true);
  };

  const handleSaveAddress = () => {
    // Refresh addresses after form submission
    fetchAddresses(user.userId);
  };

  const handleSetDefault = async (address) => {
    if (address.isDefault) return;

    try {
      // Since there's no direct API for setting default, we'll update the address
      const updatedAddress = {
        ...address,
        isDefault: true
      };
      await addressService.updateAddress(address.id, updatedAddress);
      toast.success("Default address updated");
      fetchAddresses(user.userId);
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error("Failed to set default address");
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await addressService.deleteAddress(addressId);
        toast.success("Address deleted successfully");
        fetchAddresses(user.userId);
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error("Failed to delete address");
      }
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to manage your addresses</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">My Addresses</h1>
        <button
          className="flex items-center space-x-2 bg-black text-white px-5 py-2 rounded-md text-lg font-medium hover:opacity-80 transition"
          onClick={openModal}
        >
          <FaEdit />
          <span>Add Address</span>
        </button>
      </div>

      <div className="border-b pb-2 mb-4">
        <h2 className="text-gray-700 font-medium">Address List</h2>
      </div>

      <div>
        {addresses.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No addresses found</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium mr-2">{address.addressDescription}</h3>
                    <span className="text-gray-600">{address.phoneNumber}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{address.addressDetail}</p>
                  <p className="text-gray-600">
                    {address.ward}, {address.district}, {address.province}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {address.isDefault && (
                      <span className="border border-red-400 text-red-400 px-2 py-0.5 text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-col">
                  <div className="flex gap-2 justify-end font-bold">
                    <div
                      className="text-blue-500 text-md mb-1 cursor-pointer"
                      onClick={() => handleUpdate(address)}
                    >
                      Update
                    </div>
                    {!address.isDefault && (
                      <div
                        className="text-blue-500 text-md cursor-pointer"
                        onClick={() => handleDelete(address.id)}
                      >
                        Delete
                      </div>
                    )}
                  </div>
                  {!address.isDefault && (
                    <button
                      className="border border-gray-300 hover:bg-gray-50 text-md px-3 py-1.5 rounded text-gray-600 whitespace-nowrap"
                      onClick={() => handleSetDefault(address)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <AddressForm
              onClose={closeModal}
              onSubmit={handleSaveAddress}
              initialData={currentAddress}
              isNewAddress={isNewAddress}
              userId={user.userId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
