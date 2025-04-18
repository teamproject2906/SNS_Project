import { useState, useEffect } from "react";
import { addressService } from "../../../services/addressService";
import { getUserInfo } from "../../../pages/Login/app/static";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AddressForm from "../../Address/AddressForm";

const CheckoutForm = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

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
      
      // Sort addresses to put default address first
      const sortedAddresses = [...data].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });
      
      setAddresses(sortedAddresses);
      
      // Set default address if available
      const defaultAddress = sortedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError("Failed to fetch addresses");
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressPopup(false);
  };

  const toggleAddressPopup = () => {
    setShowAddressPopup(!showAddressPopup);
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address);
    setShowAddressForm(true);
  };

  const handleAddressFormClose = () => {
    setShowAddressForm(false);
    setAddressToEdit(null);
  };

  const handleAddressFormSubmit = () => {
    // Refresh addresses after form submission
    fetchAddresses(user.userId);
  };

  return (
    <div className="w-100">
      {/* Thông tin giao hàng */}
      <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
      
      {!user ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-3">
            Bạn cần <Link to="/login" className="text-blue-600 font-medium">đăng nhập</Link> để sử dụng địa chỉ đã lưu
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-4">Đang tải địa chỉ...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Địa chỉ giao hàng</h3>
          
          {addresses.length === 0 ? (
            <div className="mb-4 p-4 border border-gray-200 rounded-md">
              <p className="text-gray-600 mb-2">Bạn chưa có địa chỉ nào</p>
              <Link to="/my-address" className="text-blue-600 hover:underline">
                Thêm địa chỉ mới
              </Link>
            </div>
          ) : (
            <>
              {/* Selected Address Card */}
              {selectedAddress && (
                <div className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium mr-2">{selectedAddress.addressDescription}</h4>
                        <span className="text-gray-600">{selectedAddress.phoneNumber}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{selectedAddress.addressDetail}</p>
                      <p className="text-gray-600">
                        {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {selectedAddress.isDefault && (
                          <span className="border border-red-400 text-red-400 px-2 py-0.5 text-xs rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={toggleAddressPopup}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              )}

              {/* Address Selection Popup */}
              {showAddressPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Chọn địa chỉ giao hàng</h3>
                      <button 
                        onClick={toggleAddressPopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`p-4 border rounded-md cursor-pointer transition-all ${
                            selectedAddress?.id === address.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleAddressSelect(address)}
                        >
                          <div className="flex items-start">
                            <div className="flex items-center mr-4 mt-1">
                              <input 
                                type="radio" 
                                name="address" 
                                checked={selectedAddress?.id === address.id}
                                onChange={() => handleAddressSelect(address)}
                                className="h-4 w-4 text-blue-600"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium mr-2">{address.addressDescription}</h4>
                                <span className="text-gray-600">{address.phoneNumber}</span>
                              </div>
                              <p className="text-gray-600 mt-1">{address.addressDetail}</p>
                              <p className="text-gray-600">
                                {address.ward}, {address.district}, {address.province}
                              </p>
                              <div className="mt-2 flex gap-2">
                                {address.isDefault && (
                                  <span className="border border-red-400 text-red-400 px-2 py-0.5 text-xs rounded">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                              }}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Cập nhật
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Link 
                        to="/my-address" 
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <span>Quản lý địa chỉ</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      
                      <button 
                        onClick={toggleAddressPopup}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Xong
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Form Popup */}
              {showAddressForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {addressToEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                      </h3>
                      <button 
                        onClick={handleAddressFormClose}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <AddressForm 
                      initialData={addressToEdit}
                      onSubmit={handleAddressFormSubmit}
                      onClose={handleAddressFormClose}
                      isNewAddress={!addressToEdit}
                      userId={user.userId}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Phương thức thanh toán */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            className="w-4 h-4"
          />
          <span>Thanh toán tại nhà</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="bankTransfer"
            className="w-4 h-4"
          />
          <span>Chuyển khoản: <strong>VPbank 01234567876 - Nguyen Van A</strong></span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="transfer"
            className="w-4 h-4"
          />
          <span>Thanh toán chuyển khoản</span>
        </label>
      </div>

      {/* Link giỏ hàng */}
      <div className="mt-6">
        <Link to="/cart" className="text-blue-600 text-sm">← Giỏ hàng</Link>
      </div>
    </div>
  );
};

export default CheckoutForm;
