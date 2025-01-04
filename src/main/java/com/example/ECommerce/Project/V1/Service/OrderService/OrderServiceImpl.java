package com.example.ECommerce.Project.V1.Service.OrderService;

import com.example.ECommerce.Project.V1.DTO.OrderDTO;
import com.example.ECommerce.Project.V1.Model.*;
import com.example.ECommerce.Project.V1.Repository.*;
import com.example.ECommerce.Project.V1.Service.OrderService.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    private UserRepository userRepository;
    private OrderStatusRepository orderStatusRepository;
    private PaymentMethodRepository paymentMethodRepository;
    private ShippingMethodRepository shippingMethodRepository;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = mapToEntity(orderDTO);
        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(UUID id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrder(UUID id, OrderDTO orderDTO) {
        Order existingOrder = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setOrderDate(orderDTO.getOrderDate());
        existingOrder.setShippingDate(orderDTO.getShippingDate());
        // Update other fields if necessary
        Order updatedOrder = orderRepository.save(existingOrder);
        return mapToDTO(updatedOrder);
    }

    @Override
    public void deleteOrder(UUID id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }

    private OrderDTO mapToDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getOrderDate(),
                order.getShippingDate(),
                order.getOrderStatus().getId(),
                order.getPaymentMethod().getId(),
                order.getShippingMethod().getId()
        );
    }

    private Order mapToEntity(OrderDTO orderDTO) {
        Order order = new Order();
        order.setId(orderDTO.getId());
        // Map user, orderStatus, paymentMethod, shippingMethod here
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found for ID: " + orderDTO.getUserId()));
        order.setUser(user);

        OrderStatus orderStatus = orderStatusRepository.findById(orderDTO.getOrderStatusId())
                .orElseThrow(() -> new EntityNotFoundException("Order status not found for ID: " + orderDTO.getOrderStatusId()));
        order.setOrderStatus(orderStatus);

        PaymentMethod paymentMethod = paymentMethodRepository.findById(orderDTO.getPaymentMethodId())
                .orElseThrow()// Ánh xạ paymentMethod từ DTO sang enum
        order.setPaymentMethod(paymentMethod);

        ShippingMethod shippingMethod = ShippingMethod.valueOf(orderDTO.getShippingMethod()); // Ánh xạ shippingMethod từ DTO sang enum
        order.setShippingMethod(shippingMethod);

        order.setOrderDate(orderDTO.getOrderDate());
        order.setShippingDate(orderDTO.getShippingDate());
        return order;
    }
}
