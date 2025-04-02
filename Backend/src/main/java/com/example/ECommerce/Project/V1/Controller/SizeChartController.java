package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Helper.ValidateRole;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Service.SizeChartService.ISizeChartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Admin/SizeChartManagement")
public class SizeChartController {

    private final ISizeChartService sizeChartService;
    private final ValidateRole validateRole;

    // Constructor Injection
    public SizeChartController(ISizeChartService sizeChartService, ValidateRole validateRole) {
        this.sizeChartService = sizeChartService;
        this.validateRole = validateRole;
    }

    @PostMapping()
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<SizeChart> createSizeChart(@RequestBody SizeChart sizeChart) {
        return new ResponseEntity<>(sizeChartService.createSizeChart(sizeChart), HttpStatus.CREATED);
    }

    @GetMapping()
    public List<SizeChartResponseDTO> getAllSizeChart() {
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (isAdminOrStaff) {
            return sizeChartService.getAllSizeChart();
        } else {
            return sizeChartService.getActiveSizeChart();
        }
    }

    @GetMapping("/{sizeChartId}")
    public ResponseEntity<SizeChart> getSizeChartById(@PathVariable("sizeChartId") Integer id) {
        SizeChart sizeChart = sizeChartService.getSizeChartById(id);
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (!isAdminOrStaff && !sizeChart.getIsActive()) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(sizeChart);
    }

    @PatchMapping("/{sizeChartId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public SizeChart updateSizeChartById(@PathVariable("sizeChartId") Integer id, @RequestBody SizeChart sizeChart) {
        return sizeChartService.updateSizeChartById(id, sizeChart);
    }

    @PatchMapping("/{sizeChartId}/toggle-status")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public SizeChart toggleSizeChartById(@PathVariable("sizeChartId") Integer id) {
        return sizeChartService.toggleSizeChartStatus(id);
    }

//    @DeleteMapping("/{sizeChartId}")
//    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
//    public ResponseEntity<String> deleteSizeChartById(@PathVariable("sizeChartId") Integer id) {
//        sizeChartService.deleteSizeChartById(id);
//
//        return new ResponseEntity<>("SizeChart is  deleted", HttpStatus.OK);
//        return ResponseEntity.ok("Deleted SizeChart with ID: " + id);
//    }
}
