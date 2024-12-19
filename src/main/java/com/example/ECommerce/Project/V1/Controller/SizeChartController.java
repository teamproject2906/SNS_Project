package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Service.SizeChartService.ISizeChartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sizecharts")
public class SizeChartController {

    private final ISizeChartService sizeChartService;

    // Constructor Injection
    public SizeChartController(ISizeChartService sizeChartService) {
        this.sizeChartService = sizeChartService;
    }

    @PostMapping()
    public ResponseEntity<SizeChart> createSizeChart(@RequestBody SizeChart sizeChart) {
        return new ResponseEntity<SizeChart>(sizeChartService.createSizeChart(sizeChart), HttpStatus.CREATED);
    }

    @GetMapping()
    public List<SizeChartResponseDTO> getAllSizeChart() {
        return sizeChartService.getAllSizeChart();
    }

    @GetMapping("/{sizeChartId}")
    public ResponseEntity<SizeChart> getSizeChartById(@PathVariable("sizeChartId") UUID id) {
        SizeChart sizeChart = sizeChartService.getSizeChartById(id);
        return ResponseEntity.ok(sizeChart);
    }

    @PatchMapping("/{sizeChartId}")
    public SizeChart updateSizeChartById(@PathVariable("sizeChartId") UUID id, @RequestBody SizeChart sizeChart) {
        return sizeChartService.updateSizeChartById(id, sizeChart);
    }

    @DeleteMapping("/{sizeChartId}")
    public ResponseEntity<String> deleteSizeChartById(@PathVariable("sizeChartId") UUID id) {
        sizeChartService.deleteSizeChartById(id);

//        return new ResponseEntity<>("SizeChart is  deleted", HttpStatus.OK);
        return ResponseEntity.ok("Deleted SizeChart with ID: " + id);
    }
}
