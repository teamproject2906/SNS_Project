import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import addressDataRaw from "./dvhcvn.json";
import { addressService } from "../../services/addressService";
import { toast } from "react-toastify";
import { getUserInfo } from "../../pages/Login/app/static";

// Convert data to react-select format
const addressData = addressDataRaw.data.map((province) => ({
  value: province.level1_id,
  label: province.name,
  districts: province.districts.map((district) => ({
    value: district.level2_id,
    label: district.name,
    wards: district.wards.map((ward) => ({
      value: ward.level3_id,
      label: ward.name,
    })),
  })),
}));

const AddressForm = ({ onClose, onSubmit, initialData, isNewAddress }) => {
  const userInfo = getUserInfo();
  const [formData, setFormData] = useState({
    addressDescription: "",
    phoneNumber: "",
    province: null,
    district: null,
    ward: null,
    addressDetail: "",
    country: "Vietnam",
    isDefault: false,
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      // Map backend data to form fields if needed
      const mappedData = {
        country: "Vietnam",
        addressDescription:
          initialData.addressDescription || initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        addressDetail: initialData.addressDetail || initialData.address || "",
        isDefault: initialData.isDefault || false,
      };

      // Find province, district, and ward objects
      const province = addressData.find(
        (p) => p.label === (initialData.province || "")
      );
      const district = province?.districts.find(
        (d) => d.label === (initialData.district || "")
      );
      const ward = district?.wards.find(
        (w) => w.label === (initialData.ward || "")
      );

      setFormData({
        ...mappedData,
        province: province || null,
        district: district || null,
        ward: ward || null,
      });
    }
  }, [initialData]);

  // Get districts based on selected province
  const getDistricts = () => {
    if (!formData.province) return [];
    const selectedProvince = addressData.find(
      (province) => province.value === formData.province.value
    );
    return selectedProvince ? selectedProvince.districts : [];
  };

  // Get wards based on selected district
  const getWards = () => {
    if (!formData.province || !formData.district) return [];
    const selectedProvince = addressData.find(
      (province) => province.value === formData.province.value
    );
    const selectedDistrict = selectedProvince.districts.find(
      (district) => district.value === formData.district.value
    );
    return selectedDistrict ? selectedDistrict.wards : [];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isDefault") {
      if (initialData && initialData?.isDefault === true) {
        alert(
          "To remove this default address, please select a new default address."
        );
        return;
      }
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    if (name === "province") {
      setFormData({
        ...formData,
        province: selectedOption,
        district: null,
        ward: null,
      });
    } else if (name === "district") {
      setFormData({
        ...formData,
        district: selectedOption,
        ward: null,
      });
    } else {
      setFormData({ ...formData, [name]: selectedOption });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.addressDescription.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!formData.province) {
      alert("Please select a province");
      return;
    }
    if (!formData.district) {
      alert("Please select a district");
      return;
    }
    if (!formData.ward) {
      alert("Please select a ward");
      return;
    }
    if (!formData.addressDetail.trim()) {
      alert("Please enter your detailed address");
      return;
    }

    // Map form data to backend format
    const addressData = {
      userId: userInfo?.id,
      country: "Vietnam",
      addressDescription: formData.addressDescription,
      phoneNumber: formData.phoneNumber,
      addressDetail: formData.addressDetail,
      province: formData.province?.label || "",
      district: formData.district?.label || "",
      ward: formData.ward?.label || "",
      isDefault: formData.isDefault,
    };

    try {
      if (userInfo?.id) {
        if (isNewAddress) {
          await addressService.addAddress(addressData);
          toast.success("Address added successfully");
          if (onSubmit) {
            onSubmit();
          }
        } else {
          await addressService.updateAddress(initialData.id, addressData);
          toast.success("Address updated successfully");
          if (onSubmit) {
            onSubmit();
          }
        }
      } else {
        toast.error("User info not found!");
      }

      // Close the form
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(
        isNewAddress ? "Failed to add address" : "Failed to update address"
      );
    }
  };

  return (
    <div className="address-form-container">
      <h2 className="text-xl font-semibold mb-4">
        {isNewAddress ? "Add New Address" : "Update Address"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row flex space-x-4 mb-4">
          <div className="form-group flex-1">
            <input
              type="text"
              name="addressDescription"
              placeholder="Full Name"
              value={formData.addressDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="form-group flex-1">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="block mb-1">Province/City</label>
          <Select
            options={addressData}
            placeholder="Select Province/City"
            onChange={(option) => handleSelectChange("province", option)}
            value={formData.province}
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block mb-1">District</label>
          <Select
            options={getDistricts()}
            placeholder="Select District"
            onChange={(option) => handleSelectChange("district", option)}
            value={formData.district}
            isDisabled={!formData.province}
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="block mb-1">Ward</label>
          <Select
            options={getWards()}
            placeholder="Select Ward"
            onChange={(option) => handleSelectChange("ward", option)}
            value={formData.ward}
            isDisabled={!formData.district}
            required
          />
        </div>

        <div className="form-group mb-4">
          <input
            type="text"
            name="addressDetail"
            placeholder="Detailed Address"
            value={formData.addressDetail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="flex items-center space-x-2">
            <label className="switch">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
              <span className="slider round"></span>
            </label>
            <p>Set as default address</p>
          </label>
        </div>

        <div className="form-actions flex justify-between">
          <button
            type="button"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {isNewAddress ? "Add Address" : "Update Address"}
          </button>
        </div>
      </form>
    </div>
  );
};

AddressForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    addressDescription: PropTypes.string,
    fullName: PropTypes.string,
    phoneNumber: PropTypes.string,
    province: PropTypes.string,
    district: PropTypes.string,
    ward: PropTypes.string,
    address: PropTypes.string,
    addressDetail: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  isNewAddress: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
};

AddressForm.defaultProps = {
  initialData: null,
  onSubmit: null,
};

export default AddressForm;
