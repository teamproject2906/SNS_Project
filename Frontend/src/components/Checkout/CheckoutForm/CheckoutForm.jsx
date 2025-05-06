import { useState, useEffect } from "react";
import { addressService } from "../../../services/addressService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AddressForm from "../../Address/AddressForm";
import { useCart } from "../../../context/CartContext";
import { useUser } from "../../../context/UserContext";

const CheckoutForm = () => {
  const { paymentMethod, setPaymentMethod, address, setAddress } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id);
    }
  }, [user?.id]);
  console.log(user);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      if (!user.id) {
        toast.error("User info not found!");
        return;
      }
      const data = await addressService.getAllAddresses(user.id);

      // Sort addresses to put default address first
      const sortedAddresses = [...data].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });

      setAddresses(sortedAddresses);

      // Set default address if available
      const defaultAddress = sortedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setAddress(defaultAddress);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to fetch addresses");
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setAddress(address);
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

  return (
    <div className="w-100">
      {/* Thông tin giao hàng */}
      <h2 className="text-xl font-semibold mb-4">Order Information</h2>

      {!user ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-3">
            You need{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              login
            </Link>{" "}
            to choose address to checkout
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-4">Address loading...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Shipping Address</h3>

          {addresses.length === 0 ? (
            <div className="mb-4 p-4 border border-gray-200 rounded-md">
              <p className="text-gray-600 mb-2">You do not have any address</p>
              <Link to="/my-address" className="text-blue-600 hover:underline">
                Add new address
              </Link>
            </div>
          ) : (
            <>
              {/* Selected Address Card */}
              {address && (
                <div className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium mr-2">
                          {address.addressDescription}
                        </h4>
                        <span className="text-gray-600">
                          {address.phoneNumber}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {address.addressDetail}
                      </p>
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
                    <button
                      onClick={toggleAddressPopup}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Address Selection Popup */}
              {showAddressPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Choose shipping address
                      </h3>
                      <button
                        onClick={toggleAddressPopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-md cursor-pointer transition-all ${
                            address?.id === address.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleAddressSelect(address)}
                        >
                          <div className="flex items-start">
                            <div className="flex items-center mr-4 mt-1">
                              <input
                                type="radio"
                                name="address"
                                checked={address?.id === address.id}
                                onChange={() => handleAddressSelect(address)}
                                className="h-4 w-4 text-blue-600"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium mr-2">
                                  {address.addressDescription}
                                </h4>
                                <span className="text-gray-600">
                                  {address.phoneNumber}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">
                                {address.addressDetail}
                              </p>
                              <p className="text-gray-600">
                                {address.ward}, {address.district},{" "}
                                {address.province}
                              </p>
                              <div className="mt-2 flex gap-2">
                                {address.isDefault && (
                                  <span className="border border-red-400 text-red-400 px-2 py-0.5 text-xs rounded">
                                    Default
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
                              Update
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
                        <span>Manage address</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>

                      <button
                        onClick={toggleAddressPopup}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Done
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
                        {addressToEdit
                          ? "Update new address"
                          : "Add new address"}
                      </h3>
                      <button
                        onClick={handleAddressFormClose}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <AddressForm
                      initialData={addressToEdit}
                      onSubmit={fetchAddresses}
                      onClose={handleAddressFormClose}
                      isNewAddress={!addressToEdit}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Phương thức thanh toán */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            className="w-4 h-4"
          />
          <span>COD (Cash on Delivery)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="paymentMethod"
            value="CREDIT"
            checked={paymentMethod === "CREDIT"}
            onChange={() => setPaymentMethod("CREDIT")}
            className="w-4 h-4"
          />
          <span>VNPay</span>
        </label>
      </div>

      {/* Link giỏ hàng */}
      <div className="mt-6">
        <Link to="/cart" className="text-blue-600 text-sm">
          ← Cart
        </Link>
      </div>
    </div>
  );
};

export default CheckoutForm;
