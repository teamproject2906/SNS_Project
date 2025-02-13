package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Model.FormClothes;
import com.example.ECommerce.Project.V1.Service.FormClothesService.IFormClothesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/formclothes")
public class FormClothesController {

    private final IFormClothesService formClothesService;

    public FormClothesController(IFormClothesService formClothesService) {
        this.formClothesService = formClothesService;
    }

    @PostMapping()
    public ResponseEntity<FormClothes> createFormClothes(@RequestBody FormClothes formClothes) {
        return new ResponseEntity<FormClothes>(formClothesService.createFormClothes(formClothes), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<FormClothes>> getAllFormClothes() {
        return new ResponseEntity<List<FormClothes>>(formClothesService.getAllFormClothes(), HttpStatus.OK);
    }

    @GetMapping("/{formClothesId}")
    public ResponseEntity<FormClothes> getFormClothesDetail(@PathVariable("formClothesId")Integer formClothesId) {
        return new ResponseEntity<FormClothes>(formClothesService.getFormClothesById(formClothesId), HttpStatus.OK);
    }

    @PatchMapping("/{formClothesId}")
    public ResponseEntity<FormClothes> updateFormClothesById(@PathVariable("formClothesId")Integer formClothesId,
                                                             @RequestBody FormClothes formClothes) {
        return new ResponseEntity<FormClothes>(formClothesService.updateFormClothes(formClothesId, formClothes), HttpStatus.OK);
    }

    @DeleteMapping("/{formClothesId}")
    public ResponseEntity<String> deleteFormClothesById(@PathVariable("formClothesId")Integer formClothesId) {
        formClothesService.deleteFormClothesById(formClothesId);
        return new ResponseEntity<String>("Delete FormClothes with id: " + formClothesId, HttpStatus.OK);
    }
}
