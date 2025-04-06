package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AddressDTO;
import com.example.ECommerce.Project.V1.Service.AddressService.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;  // Sử dụng interface thay vì implementation

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO addressDTO) {
        AddressDTO createdAddress = addressService.createAddress(addressDTO);
        return ResponseEntity.ok(createdAddress);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserId(@PathVariable Integer userId) {
        List<AddressDTO> addresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<AddressDTO> getDefaultAddress(@PathVariable Integer userId) {
        AddressDTO address = addressService.getDefaultAddress(userId);
        return ResponseEntity.ok(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Integer id,
                                                    @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress = addressService.updateAddress(id, addressDTO);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Integer id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
