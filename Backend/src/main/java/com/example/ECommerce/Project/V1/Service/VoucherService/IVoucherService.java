package com.example.ECommerce.Project.V1.Service.VoucherService;

import com.example.ECommerce.Project.V1.DTO.ResponseDTO.PageableResponse;
import com.example.ECommerce.Project.V1.DTO.VoucherDTO;

import java.util.List;

public interface IVoucherService {
//    PageableResponse<VoucherDTO> getAllVoucher(int pageNumber, int pageSize, String sortBy, String sortDir);
    List<VoucherDTO> getAllVoucher();
    VoucherDTO getVoucherById(Integer id);
    List<VoucherDTO> searchVoucher(String keyword);
    VoucherDTO createVoucher(VoucherDTO voucherDTO);
    VoucherDTO updateVoucher(VoucherDTO voucherDTO, Integer id);
    void deactivateVoucher(Integer id);
}
