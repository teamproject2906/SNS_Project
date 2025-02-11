package com.example.ECommerce.Project.V1.V1.Controller;

import com.example.ECommerce.Project.V1.Model.NumericSize;
import com.example.ECommerce.Project.V1.Service.NumericSizeService.INumericSizeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Admin/NumericManagement")
public class NumericSizeController {

    private final INumericSizeService numericSizeService;

    public NumericSizeController(INumericSizeService numericSizeService) {
        this.numericSizeService = numericSizeService;
    }

    @PostMapping()
    public ResponseEntity<NumericSize> createNewNumericSize(@RequestBody NumericSize numericSize) {
        return new ResponseEntity<NumericSize>(numericSizeService.createNumericSize(numericSize), HttpStatus.CREATED);
    }

    @GetMapping()
    public List<NumericSize> getAllNumericSizes() {
        return numericSizeService.getAllNumericSizes();
    }

    @GetMapping("/{numericSizeId}")
    public NumericSize getNumericSizeById(@PathVariable Integer numericSizeId) {
        return numericSizeService.getNumericSizeById(numericSizeId);
    }

    @PatchMapping("/{numericSizeId}")
    public NumericSize updateNumericSizeById(@PathVariable Integer numericSizeId, @RequestBody NumericSize numericSize) {
        return numericSizeService.updateNumericSize(numericSizeId, numericSize);
    }

    @DeleteMapping("/{numericSizeId}")
    public ResponseEntity<String> deleteNumericSizeById(@PathVariable Integer numericSizeId) {
        numericSizeService.deleteNumericSizeById(numericSizeId);

        return ResponseEntity.ok("Deleted numericSize with ID: " + numericSizeId);
    }
}
