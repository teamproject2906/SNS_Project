package com.example.ECommerce.Project.V1.Service;

import com.example.ECommerce.Project.V1.DTO.BestSellerDTO;
import com.example.ECommerce.Project.V1.Model.BestSeller;
import com.example.ECommerce.Project.V1.Model.OrderStatus;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Model.ProductGallery;
import com.example.ECommerce.Project.V1.Repository.BestSellerRepository;
import com.example.ECommerce.Project.V1.Repository.OrderItemRepository;
import com.example.ECommerce.Project.V1.Repository.ProductGalleryRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BestSellerService {

    @Autowired
    private BestSellerRepository bestSellerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ProductGalleryRepository productGalleryRepository;

    /**
     * Tạo hoặc lấy BestSeller cho một Product
     */
    @Transactional
    public BestSeller getOrCreateBestSeller(Integer productId) {
        Optional<BestSeller> existingBestSeller = bestSellerRepository.findByProductId(productId);

        if (existingBestSeller.isPresent()) {
            return existingBestSeller.get();
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + productId + " not found"));

        BestSeller newBestSeller = BestSeller.builder()
                .product(product)
                .quantitySold(0)
                .build();

        return bestSellerRepository.save(newBestSeller);
    }

    /**
     * Cập nhật số lượng đã bán cho một sản phẩm dựa trên OrderItem
     */
    @Transactional
    public void updateBestSellerQuantity(Integer productId) {
        Integer totalSold = orderItemRepository.sumQuantityByProductIdAndStatus(productId, OrderStatus.COMPLETED);
        if (totalSold == null) {
            totalSold = 0;
        }

        BestSeller bestSeller = getOrCreateBestSeller(productId);
        bestSeller.setQuantitySold(totalSold);
        bestSellerRepository.save(bestSeller);
    }

    /**
     * Cập nhật số lượng đã bán cho tất cả sản phẩm
     */
    @Transactional
    public void updateAllBestSellers() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            updateBestSellerQuantity(product.getId());
        }
    }

    /**
     * Lấy danh sách BestSellerDTO theo thứ tự số lượng bán giảm dần
     */
    public List<BestSellerDTO> getTopBestSellers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<BestSeller> bestSellers = bestSellerRepository.findTopByOrderByQuantitySoldDesc(pageable);
        List<BestSeller> nonUniqueBestSellers = new ArrayList<>();
        Set<String> seenProductCodes = new HashSet<>();
        for (BestSeller bestSeller: bestSellers){
            String productCode = bestSeller.getProduct().getProductCode();
            // Nếu productCode chưa xuất hiện, thêm BestSeller vào danh sách và đánh dấu productCode
            if (seenProductCodes.add(productCode)) {
                nonUniqueBestSellers.add(bestSeller);
            }
        }
        return bestSellers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BestSellerDTO> getTopBestSellersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        Pageable pageable = PageRequest.of(0, 3); // Giới hạn 3 sản phẩm

        List<Object[]> results = orderItemRepository.findTopSellingProductIdsByDateRange(
                OrderStatus.COMPLETED,
                startDate,
                endDate,
                pageable
        );

        List<BestSellerDTO> dtos = new ArrayList<>();
        for (Object[] row : results) {
            Integer productId = (Integer) row[0];
            Long quantitySold = (Long) row[1]; // vì SUM trả về Long

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

            dtos.add(BestSellerDTO.builder()
                    .id(null) // Không có BestSeller ID trong logic này, để null hoặc bỏ qua
                    .productId(productId)
                    .productName(product.getProductName())
                    .quantitySold(quantitySold.intValue())
                    .build());
        }

        return dtos;
    }


    /**
     * Lấy BestSellerDTO theo productId
     */
    public Optional<BestSellerDTO> getBestSellerByProductId(Integer productId) {
        return bestSellerRepository.findByProductId(productId)
                .map(this::convertToDTO);
    }

    /**
     * Chuyển đổi từ BestSeller sang BestSellerDTO
     */
    private BestSellerDTO convertToDTO(BestSeller bestSeller) {

        ProductGallery productGallery = productGalleryRepository.getProductGalleryByIdAndMinSortOrder(bestSeller.getProduct().getId());

        return BestSellerDTO.builder()
                .id(bestSeller.getId())
                .productId(bestSeller.getProduct().getId())
                .productCode(bestSeller.getProduct().getProductCode())
                .productImg(productGallery.getImageUrl())
                .size(bestSeller.getProduct().getSizeChart().getValue())
                .color(bestSeller.getProduct().getColor())
                .productName(bestSeller.getProduct().getProductName())
                .quantitySold(bestSeller.getQuantitySold())
                .build();
    }
}
