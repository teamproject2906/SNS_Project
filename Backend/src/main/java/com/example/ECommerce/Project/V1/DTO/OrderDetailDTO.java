package com.example.ECommerce.Project.V1.DTO;

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

    private Integer id; // ID của đơn hàng

    private Integer userId; // ID của người dùng

    private Integer addressId;

    private String username;

    private List<OrderItemDTO> orderItems; // Danh sách sản phẩm trong đơn hàng

    private Double totalAmount; // Tổng giá trị đơn hàng

    private LocalDateTime orderDate; // Ngày đặt hàng

    private LocalDateTime shippingDate; // Ngày giao hàng dự kiến

    private String orderStatus; // ID trạng thái đơn hàng

    private String paymentMethod; // ID phương thức thanh toán

    private Integer voucherId;
}
