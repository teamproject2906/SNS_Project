package com.example.ECommerce.Project.V1.Service.AddressService;

import com.example.ECommerce.Project.V1.DTO.AddressDTO;
import com.example.ECommerce.Project.V1.Model.Address;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.AddressRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO) {
        Address address = mapToEntity(addressDTO);
        User user = userRepository.findById(addressDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        address.setUser(user);

        // Nếu địa chỉ mới được set là mặc định
        if (addressDTO.getIsDefault()) {
            // Cập nhật tất cả các địa chỉ khác của user thành không mặc định
            addressRepository.resetDefaultAddresses(user.getId());
        }

        Address savedAddress = addressRepository.save(address);
        return mapToDTO(savedAddress);
    }

    @Override
    public AddressDTO getAddressById(Integer id){
        Address add = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found address with id"));
        return mapToDTO(add);
    }

    @Override
    public List<AddressDTO> getAddressesByUserId(Integer userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO getDefaultAddress(Integer userId) {
        return addressRepository.findByUserIdAndIsDefault(userId, true)
                .stream()
                .findFirst()
                .map(this::mapToDTO)
                .orElse(null);
    }

    @Override
    public AddressDTO updateAddress(Integer id, AddressDTO addressDTO) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Nếu chuyển từ không mặc định -> mặc định
        if (!address.getIsDefault() && addressDTO.getIsDefault()) {
            addressRepository.resetDefaultAddresses(address.getUser().getId());
        }

        address.setAddressDescription(addressDTO.getAddressDescription());
        address.setAddressDetail(addressDTO.getAddressDetail());
        address.setWard(addressDTO.getWard());
        address.setDistrict(addressDTO.getDistrict());
        address.setProvince(addressDTO.getProvince());
        address.setCountry(addressDTO.getCountry());
        address.setPhoneNumber(addressDTO.getPhoneNumber());
        address.setIsDefault(addressDTO.getIsDefault());

        Address updatedAddress = addressRepository.save(address);
        return mapToDTO(updatedAddress);
    }

    @Override
    public void deleteAddress(Integer id) {
        addressRepository.deleteById(id);
    }

    private AddressDTO mapToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setAddressDescription(address.getAddressDescription());
        dto.setAddressDetail(address.getAddressDetail());
        dto.setWard(address.getWard());
        dto.setDistrict(address.getDistrict());
        dto.setProvince(address.getProvince());
        dto.setCountry(address.getCountry());
        dto.setPhoneNumber(address.getPhoneNumber());
        dto.setIsDefault(address.getIsDefault());
        dto.setUserId(address.getUser().getId());
        return dto;
    }

    private Address mapToEntity(AddressDTO dto) {
        Address address = new Address();
        address.setAddressDescription(dto.getAddressDescription());
        address.setAddressDetail(dto.getAddressDetail());
        address.setWard(dto.getWard());
        address.setDistrict(dto.getDistrict());
        address.setProvince(dto.getProvince());
        address.setCountry(dto.getCountry());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setIsDefault(dto.getIsDefault());
        return address;
    }
}
