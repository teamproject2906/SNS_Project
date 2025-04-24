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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements IVoucherService{

    private final VoucherRepository voucherRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<VoucherDTO> getAllVoucher() {
//        Sort sort = (sortDir.equalsIgnoreCase("desc")) ? (Sort.by(sortBy).descending()) : (Sort.by(sortBy).ascending());
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        List<Voucher> pages = voucherRepository.findAll();
        return pages.stream().map(voucher -> modelMapper.map(voucher, VoucherDTO.class)).collect(Collectors.toList());
//        return Helper.getPageableResponse(page, VoucherDTO.class);
    }

    @Override
    public VoucherDTO getVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher Not Found"));
        return modelMapper.map(voucher, VoucherDTO.class);
    }

    @Override
    public List<VoucherDTO> searchVoucher(String keyword) {
//        Sort sort = (sortDir.equalsIgnoreCase("desc")) ? (Sort.by(sortBy).descending()) : (Sort.by(sortBy).ascending());
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        List<Voucher> pages = voucherRepository.findByVoucherCodeContaining(keyword);
        return pages.stream().map(voucher -> modelMapper.map(voucher, VoucherDTO.class)).collect(Collectors.toList());
    }

    @Override
    public VoucherDTO createVoucher(VoucherDTO voucherDTO) {

        if (!(voucherRepository.findByVoucherCodeContaining(voucherDTO.getVoucherCode()).isEmpty())) {
            throw new IllegalArgumentException("Voucher code already exists.");
        }

        validateVoucher(voucherDTO);

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

        validateVoucher(voucherDTO);

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

    private void validateVoucher(VoucherDTO voucherDTO) {
        // Validate usage limit > 0
        if (voucherDTO.getUsageLimit() <= 0) {
            throw new IllegalArgumentException("Usage limit must be greater than 0.");
        }

        // Validate discount > 0 and < 1
        if (!(voucherDTO.getDiscount() > 0 && voucherDTO.getDiscount() < 1)) {
            throw new IllegalArgumentException("Discount must be greater than 0 and less than 1.");
        }

        // Validate start date > now
        if (voucherDTO.getStartDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start date must be after today.");
        }

        // Validate voucher code (uppercase letters and numbers only)
        if (!voucherDTO.getVoucherCode().matches("^[A-Z0-9]+$")) {
            throw new IllegalArgumentException("Voucher code must contain only uppercase letters and numbers.");
        }
    }
}
