package com.example.ECommerce.Project.V1.Service;

import com.example.ECommerce.Project.V1.DTO.OrderItemDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {

    private UUID id; // ID của đơn hàng

    private UUID userId; // ID của người dùng

    private List<OrderItemDTO> orderItems; // Danh sách sản phẩm trong đơn hàng

    private Double totalAmount; // Tổng giá trị đơn hàng

    private LocalDateTime orderDate; // Ngày đặt hàng

    private LocalDateTime shippingDate; // Ngày giao hàng dự kiến

    private Integer orderStatusId; // ID trạng thái đơn hàng

    private UUID paymentMethodId; // ID phương thức thanh toán
}
