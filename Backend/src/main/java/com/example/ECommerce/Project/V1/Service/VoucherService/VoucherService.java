package com.example.ECommerce.Project.V1.Service.VoucherService;

import com.example.ECommerce.Project.V1.DTO.ResponseDTO.PageableResponse;
import com.example.ECommerce.Project.V1.DTO.VoucherDTO;
import com.example.ECommerce.Project.V1.Helper.Helper;
import com.example.ECommerce.Project.V1.Model.Voucher;
import com.example.ECommerce.Project.V1.Repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoucherService implements IVoucherService{

    private final VoucherRepository voucherRepository;
    private final ModelMapper modelMapper;

    @Override
    public PageableResponse<VoucherDTO> getAllVoucher(int pageNumber, int pageSize, String sortBy, String sortDir) {
        Sort sort = (sortDir.equalsIgnoreCase("desc")) ? (Sort.by(sortBy).descending()) : (Sort.by(sortBy).ascending());
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Voucher> page = voucherRepository.findAll(pageable);
        return Helper.getPageableResponse(page, VoucherDTO.class);
    }

    @Override
    public VoucherDTO getVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher Not Found"));
        return modelMapper.map(voucher, VoucherDTO.class);
    }

    @Override
    public PageableResponse<VoucherDTO> searchVoucher(String keyword, int pageNumber, int pageSize, String sortBy, String sortDir) {
        Sort sort = (sortDir.equalsIgnoreCase("desc")) ? (Sort.by(sortBy).descending()) : (Sort.by(sortBy).ascending());
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Voucher> page = voucherRepository.findByVoucherCodeContaining(keyword, pageable);
        return Helper.getPageableResponse(page, VoucherDTO.class);
    }

    @Override
    public VoucherDTO createVoucher(VoucherDTO voucherDTO) {
        var voucher = Voucher.builder()
                .voucherCode(voucherDTO.getVoucherCode())
                .startDate(voucherDTO.getStartDate())
                .endDate(voucherDTO.getEndDate())
                .discount(voucherDTO.getDiscount())
                .usageLimit(voucherDTO.getUsageLimit())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .createdBy("ADMIN")
                .updatedBy("ADMIN")
                .isActive(true)
                .build();
        Voucher saved = voucherRepository.save(voucher);
        return modelMapper.map(saved, VoucherDTO.class);
    }

    @Override
    public VoucherDTO updateVoucher(VoucherDTO voucherDTO, Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher Not Found"));
        voucher.setVoucherCode(voucherDTO.getVoucherCode());
        voucher.setStartDate(voucherDTO.getStartDate());
        voucher.setEndDate(voucherDTO.getEndDate());
        voucher.setDiscount(voucherDTO.getDiscount());
        voucher.setUsageLimit(voucherDTO.getUsageLimit());
        voucher.setUpdatedAt(LocalDateTime.now());
        voucher.setUpdatedBy("ADMIN");
        voucherRepository.save(voucher);
        return modelMapper.map(voucher, VoucherDTO.class);
    }

    @Override
    public void deactivateVoucher(Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher Not Found"));
        voucher.setIsActive(false);
        voucherRepository.save(voucher);
    }
}
