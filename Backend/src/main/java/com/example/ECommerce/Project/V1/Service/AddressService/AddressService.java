package com.example.ECommerce.Project.V1.Service.AddressService;

import com.example.ECommerce.Project.V1.DTO.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO);
    List<AddressDTO> getAddressesByUserId(Integer userId);
    AddressDTO getDefaultAddress(Integer userId);
    AddressDTO updateAddress(Integer id, AddressDTO addressDTO);
    void deleteAddress(Integer id);
}
