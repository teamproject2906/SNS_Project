package com.example.ECommerce.Project.V1.Service.VoucherService;

import com.example.ECommerce.Project.V1.DTO.ResponseDTO.PageableResponse;
import com.example.ECommerce.Project.V1.DTO.VoucherDTO;

public interface IVoucherService {
    PageableResponse<VoucherDTO> getAllVoucher(int pageNumber, int pageSize, String sortBy, String sortDir);
    VoucherDTO getVoucherById(Integer id);
    PageableResponse<VoucherDTO> searchVoucher(String keyword, int pageNumber, int pageSize, String sortBy, String sortDir);
    VoucherDTO createVoucher(VoucherDTO voucherDTO);
    VoucherDTO updateVoucher(VoucherDTO voucherDTO, Integer id);
    void deactivateVoucher(Integer id);
}
