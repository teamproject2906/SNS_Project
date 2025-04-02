package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.NumericSizeResponseDTO;
import com.example.ECommerce.Project.V1.Helper.ValidateRole;
import com.example.ECommerce.Project.V1.Model.NumericSize;
import com.example.ECommerce.Project.V1.Service.NumericSizeService.INumericSizeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Admin/NumericManagement")
public class NumericSizeController {

    private final INumericSizeService numericSizeService;
    private final ValidateRole validateRole;

    public NumericSizeController(INumericSizeService numericSizeService, ValidateRole validateRole) {
        this.numericSizeService = numericSizeService;
        this.validateRole = validateRole;
    }

    @PostMapping()
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<NumericSize> createNewNumericSize(@RequestBody NumericSize numericSize) {
        return new ResponseEntity<>(numericSizeService.createNumericSize(numericSize), HttpStatus.CREATED);
    }

    @GetMapping()
    public List<NumericSizeResponseDTO> getAllNumericSizes() {
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (isAdminOrStaff) {
            return numericSizeService.getAllNumericSizes();
        } else {
            return numericSizeService.getActiveNumericSize();
        }

    }

    @GetMapping("/{numericSizeId}")
    public ResponseEntity<NumericSize> getNumericSizeById(@PathVariable Integer numericSizeId) {
        NumericSize numericSize = numericSizeService.getNumericSizeById(numericSizeId);
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (!isAdminOrStaff && !numericSize.getIsActive()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(numericSize);
    }

    @PatchMapping("/{numericSizeId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public NumericSize updateNumericSizeById(@PathVariable Integer numericSizeId, @RequestBody NumericSize numericSize) {
        return numericSizeService.updateNumericSize(numericSizeId, numericSize);
    }

    @PatchMapping("/{numericSizeId}/toggle-status")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public NumericSize reActiveNumericSizeById(@PathVariable Integer numericSizeId) {
        return numericSizeService.toggleNumericSizeStatus(numericSizeId);
    }

//    @DeleteMapping("/{numericSizeId}")
//    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
//    public ResponseEntity<String> deleteNumericSizeById(@PathVariable Integer numericSizeId) {
//        numericSizeService.deleteNumericSizeById(numericSizeId);
//
//        return ResponseEntity.ok("Deleted numericSize with ID: " + numericSizeId);
//    }
}
