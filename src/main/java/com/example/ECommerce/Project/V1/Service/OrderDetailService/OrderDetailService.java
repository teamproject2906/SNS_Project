package com.example.ECommerce.Project.V1.Service.OrderDetailService;

import com.example.ECommerce.Project.V1.DTO.OrderDetailDTO;

import java.util.List;
import java.util.UUID;

public interface OrderDetailService {
    List<OrderDetailDTO> getAllOrders();
    OrderDetailDTO getOrderById(UUID id);
    OrderDetailDTO createOrder(OrderDetailDTO orderDetailDTO);
    OrderDetailDTO updateOrder(UUID id, OrderDetailDTO orderDetailDTO);
    void deleteOrder(UUID id);
}
