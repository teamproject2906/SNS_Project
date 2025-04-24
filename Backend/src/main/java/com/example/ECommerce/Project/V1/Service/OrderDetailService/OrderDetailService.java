package com.example.ECommerce.Project.V1.Service.OrderDetailService;

import com.example.ECommerce.Project.V1.DTO.OrderDetailDTO;
import com.example.ECommerce.Project.V1.Model.OrderDetail;
import com.example.ECommerce.Project.V1.Model.OrderStatus;

import java.util.List;
import java.util.UUID;

public interface OrderDetailService {
    List<OrderDetailDTO> getAllOrders();
    OrderDetailDTO getOrderById(Integer id);
    List<OrderDetailDTO> getOrdersByUserIdAndOrderStatus(Integer userId, OrderStatus orderStatus);
    OrderDetailDTO createOrder(OrderDetailDTO orderDetailDTO);
    OrderDetailDTO updateOrder(Integer id, OrderDetailDTO orderDetailDTO);
    void deleteOrder(Integer id);
    void deactivateOrder(Integer id);
}
