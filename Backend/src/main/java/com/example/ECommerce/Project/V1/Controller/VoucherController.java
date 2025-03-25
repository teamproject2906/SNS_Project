package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.PageableResponse;
import com.example.ECommerce.Project.V1.DTO.ResponseMessageAPI;
import com.example.ECommerce.Project.V1.DTO.VoucherDTO;
import com.example.ECommerce.Project.V1.Service.VoucherService.IVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/shop")
@RequiredArgsConstructor
public class VoucherController {

    private final IVoucherService voucherService;

    @PostMapping()
    public ResponseEntity<VoucherDTO> addVoucher(@RequestBody VoucherDTO voucherDTO) {
        VoucherDTO createdVoucher = voucherService.createVoucher(voucherDTO);
        return new ResponseEntity<>(createdVoucher, HttpStatus.CREATED);
    }

    @PutMapping({"/{voucherId}"})
    public ResponseEntity<VoucherDTO> updateVoucher(
            @PathVariable Integer voucherId,
            @RequestBody VoucherDTO voucherDTO)
    {
        VoucherDTO updatedVoucher = voucherService.updateVoucher(voucherDTO, voucherId);
        return new ResponseEntity<>(updatedVoucher, HttpStatus.OK);
    }

    @DeleteMapping("/{voucherId}")
    public ResponseEntity<ResponseMessageAPI> deleteVoucher(@PathVariable Integer voucherId){
        voucherService.deactivateVoucher(voucherId);
        ResponseMessageAPI responseMessage = ResponseMessageAPI.builder()
                .message("Delete voucher successfully")
                .status(HttpStatus.OK)
                .success(true)
                .build();
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @GetMapping("/{voucherId}")
    public  ResponseEntity<VoucherDTO> getVoucherById(
            @PathVariable Integer voucherId
    ){
        VoucherDTO voucherDTO = voucherService.getVoucherById(voucherId);
        return new ResponseEntity<>(voucherDTO, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<PageableResponse<VoucherDTO>> getAllVoucher(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "title", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
    ){
        PageableResponse<VoucherDTO> pageableResponse = voucherService.getAllVoucher(pageNumber, pageSize, sortBy, sortDir);
        return new ResponseEntity<>(pageableResponse, HttpStatus.OK);
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<PageableResponse<VoucherDTO>> searchVoucher(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "voucherCode", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @PathVariable String keyword
    ){
        PageableResponse<VoucherDTO> pageableResponse = voucherService.searchVoucher(keyword, pageNumber, pageSize, sortBy, sortDir);
        return new ResponseEntity<>(pageableResponse, HttpStatus.OK);
    }
}
