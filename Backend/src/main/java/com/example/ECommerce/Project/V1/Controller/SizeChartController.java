package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.DTO.SizeChartTypeResponse;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Service.SizeChartService.ISizeChartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Admin/SizeChartManagement")
public class SizeChartController {

    private final ISizeChartService sizeChartService;

    // Constructor Injection
    public SizeChartController(ISizeChartService sizeChartService) {
        this.sizeChartService = sizeChartService;
    }

    @PostMapping()
    public ResponseEntity<SizeChart> createSizeChart(@RequestBody SizeChart sizeChart) {
        return new ResponseEntity<>(sizeChartService.createSizeChart(sizeChart), HttpStatus.CREATED);
    }

    @GetMapping()
    public List<SizeChartResponseDTO> getAllSizeChart() {
        return sizeChartService.getAllSizeChart();
    }

    @GetMapping("/getDistinctSizeChart")
    public List<SizeChartTypeResponse> getAllDistinctSizeChart(){
        return sizeChartService.getAllDistinctSizeChart();
    }

    @GetMapping("/{sizeChartId}")
    public ResponseEntity<SizeChart> getSizeChartById(@PathVariable("sizeChartId") Integer id) {
        SizeChart sizeChart = sizeChartService.getSizeChartById(id);
        return ResponseEntity.ok(sizeChart);
    }

    @PatchMapping("/{sizeChartId}")
    public SizeChart updateSizeChartById(@PathVariable("sizeChartId") Integer id, @RequestBody SizeChart sizeChart) {
        return sizeChartService.updateSizeChartById(id, sizeChart);
    }

    @PatchMapping("/reactive/{sizeChartId}")
    public SizeChart reActiveSizeChartById(@PathVariable("sizeChartId") Integer id) {
        return sizeChartService.reActivateSizeChartById(id);
    }

    @DeleteMapping("/{sizeChartId}")
    public ResponseEntity<String> deactivateSizeChartById(@PathVariable("sizeChartId") Integer id) {
        sizeChartService.deactivateSizeChartById(id);
        return ResponseEntity.ok("Deactivated SizeChart with ID: " + id);
    }
}
