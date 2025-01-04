package com.example.ECommerce.Project.V1.Service.OrderService;

import com.example.ECommerce.Project.V1.DTO.OrderDTO;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(UUID id);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrder(UUID id, OrderDTO orderDTO);
    void deleteOrder(UUID id);
}