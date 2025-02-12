package com.example.ECommerce.Project.V1.Controller;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Admin/AdminManagement")
@PreAuthorize(value = "hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
//@Hidden
public class AdminController {
    @GetMapping
    @PreAuthorize("hasAuthority('admin:viewData')")
    public String viewData(Authentication authentication) {
        System.out.println("Authorities: " + authentication.getAuthorities());
        return "Only admin has right and obligations to view list of data";
    }

    @PostMapping
    @PreAuthorize(value = "hasAuthority('admin:insertData')")
    public String insertData(){
        return "Only admin has right and obligations to insert data";
    }

    @PutMapping
    @PreAuthorize(value = "hasAuthority('admin:updateData')")
    public String updateData(){
        return "Only admin has right and obligations to update data";
    }

    @DeleteMapping
    @PreAuthorize(value = "hasAuthority('admin:deleteData')")
    public String deleteData(){
        return "Only admin has right and obligations to delete data";
    }
}
