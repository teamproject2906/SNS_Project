package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AlphabetSizeResponseDTO;
import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import com.example.ECommerce.Project.V1.Service.AlphabetSizeService.IAlphabetSizeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/Admin/AlphabetSizeManagement")
public class AlphabetSizeController {

    private final IAlphabetSizeService alphabetSizeService;

    public AlphabetSizeController(IAlphabetSizeService alphabetSizeService, SizeChartRepository sizeChartRepository) {
        this.alphabetSizeService = alphabetSizeService;
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
    public ResponseEntity<AlphabetSizeResponseDTO> createNewAlphabetSize(@RequestBody AlphabetSize alphabetSize) {
        return new ResponseEntity<AlphabetSizeResponseDTO>(alphabetSizeService.createAlphabetSize(alphabetSize),HttpStatus.CREATED);
    }

    @GetMapping()
    public List<AlphabetSize> getAllAlphabetSizes() {
        return alphabetSizeService.getAllAlphabetSize();
    }

    @GetMapping("/{alphabetSizeId}")
    public ResponseEntity<AlphabetSize> getAlphabetSizeById(@PathVariable("alphabetSizeId") UUID id) {
//        return new ResponseEntity<AlphabetSize>(alphabetSizeService.getAlphabetSizeById(id), HttpStatus.OK);
        AlphabetSize alphabetSize = alphabetSizeService.getAlphabetSizeById(id);
        return ResponseEntity.ok(alphabetSize);
    }

    @PatchMapping("/{alphabetSizeId}")
    public ResponseEntity<AlphabetSize> updateAlphabetSize(@PathVariable("alphabetSizeId") UUID id, @RequestBody AlphabetSize alphabetSize) {
        AlphabetSize updatedAlphabetSize = alphabetSizeService.updateAlphabetSize(id, alphabetSize);

        return ResponseEntity.ok(updatedAlphabetSize);
    }

    @DeleteMapping("/{alphabetSizeId}")
    public ResponseEntity<String> deleteAlphabetSizeById(@PathVariable("alphabetSizeId") UUID id) {
        alphabetSizeService.deleteAlphabetSizeById(id);

        return ResponseEntity.ok("Deleted AlphabetSize with ID: " + id);
    }
}
