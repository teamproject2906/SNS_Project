package com.example.ECommerce.Project.V1.Service.OrderItemService;

import com.example.ECommerce.Project.V1.DTO.OrderItemDTO;

import java.util.List;

public interface OrderItemService {
    List<OrderItemDTO> getAllOrderItems();
    OrderItemDTO getOrderItemById(Integer id);
    OrderItemDTO createOrderItem(OrderItemDTO orderItemDTO);
    OrderItemDTO updateOrderItem(Integer id, OrderItemDTO orderItemDTO);
    void deleteOrderItem(Integer id);
}
