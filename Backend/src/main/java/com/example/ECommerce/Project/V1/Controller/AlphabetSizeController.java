package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AlphabetSizeResponseDTO;
import com.example.ECommerce.Project.V1.Helper.ValidateRole;
import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import com.example.ECommerce.Project.V1.Service.AlphabetSizeService.IAlphabetSizeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Admin/AlphabetSizeManagement")
public class AlphabetSizeController {

    private final IAlphabetSizeService alphabetSizeService;
    private final ValidateRole validateRole;

    public AlphabetSizeController(IAlphabetSizeService alphabetSizeService, SizeChartRepository sizeChartRepository, ValidateRole validateRole) {
        this.alphabetSizeService = alphabetSizeService;
        this.validateRole = validateRole;
    }

//    public ResponseEntity<AlphabetSize> addAlphabetSize(@RequestBody AlphabetSizeDTO alphabetSizeDTO) {
//        // Get SizeChart by Id
//        SizeChart sizeChart = sizeChartRepository.findById(UUID
//                .fromString(alphabetSizeDTO.getSizeChart()))
//                .orElseThrow(() -> new EntityNotFoundException("Size Chart not found"));
//
//        AlphabetSize newAlphabetSize = new AlphabetSize();
//        newAlphabetSize.setSizeChart(sizeChart);
//        newAlphabetSize.setAlphabetSize(alphabetSizeDTO.getAlphabetSize());
//
//        return new ResponseEntity<AlphabetSize>(alphabetSizeService.createAlphabetSize(newAlphabetSize),HttpStatus.CREATED);
//    }

    @PostMapping()
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<AlphabetSizeResponseDTO> createNewAlphabetSize(@RequestBody AlphabetSize alphabetSize) {
        return new ResponseEntity<>(alphabetSizeService.createAlphabetSize(alphabetSize),HttpStatus.CREATED);
    }

    @GetMapping()
    public List<AlphabetSizeResponseDTO> getAllAlphabetSizes() {
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (isAdminOrStaff) {
            return alphabetSizeService.getAllAlphabetSize();
        } else {
            return alphabetSizeService.getActiveAlphabetSize();
        }

    }

    @GetMapping("/{alphabetSizeId}")
    public ResponseEntity<AlphabetSize> getAlphabetSizeById(@PathVariable("alphabetSizeId") Integer id) {
        AlphabetSize alphabetSize = alphabetSizeService.getAlphabetSizeById(id);
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (!isAdminOrStaff && !alphabetSize.getIsActive()) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(alphabetSize);
    }

    @PatchMapping("/{alphabetSizeId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<AlphabetSize> updateAlphabetSize(@PathVariable("alphabetSizeId") Integer id, @RequestBody AlphabetSize alphabetSize) {
        AlphabetSize updatedAlphabetSize = alphabetSizeService.updateAlphabetSize(id, alphabetSize);

        return ResponseEntity.ok(updatedAlphabetSize);
    }

    @PatchMapping("/{alphabetSizeId}/toggle-status")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public AlphabetSize toggleAlphabetSizeById(@PathVariable("alphabetSizeId") Integer id) {
        return alphabetSizeService.toggleAlphabetSizeStatus(id);
    }

//    @DeleteMapping("/{alphabetSizeId}")
//    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
//    public ResponseEntity<String> deleteAlphabetSizeById(@PathVariable("alphabetSizeId") Integer id) {
//        alphabetSizeService.deleteAlphabetSizeById(id);
//
//        return ResponseEntity.ok("Deleted AlphabetSize with ID: " + id);
//    }
}
