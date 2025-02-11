package com.example.ECommerce.Project.V1.Service.OrderItemService;

import com.example.ECommerce.Project.V1.DTO.OrderItemDTO;
import com.example.ECommerce.Project.V1.Model.OrderItem;
import com.example.ECommerce.Project.V1.Repository.OrderItemRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public OrderItemDTO createOrderItem(OrderItemDTO orderItemDTO) {
        OrderItem orderItem = modelMapper.map(orderItemDTO, OrderItem.class);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        return modelMapper.map(savedOrderItem, OrderItemDTO.class);
    }

    @Override
    public List<OrderItemDTO> getAllOrderItems() {
        List<OrderItem> orderItems = orderItemRepository.findAll();
        return orderItems.stream()
                .map(orderItem -> modelMapper.map(orderItem, OrderItemDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderItemDTO getOrderItemById(Integer id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with id: " + id));
        return modelMapper.map(orderItem, OrderItemDTO.class);
    }

    @Override
    public OrderItemDTO updateOrderItem(Integer id, OrderItemDTO orderItemDTO) {
        OrderItem existingOrderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with id: " + id));

        existingOrderItem.setQuantity(orderItemDTO.getQuantity());
        existingOrderItem.setProduct(modelMapper.map(orderItemDTO.getProductId(), OrderItem.class).getProduct());
        existingOrderItem.setOrderDetail(modelMapper.map(orderItemDTO.getOrderId(), OrderItem.class).getOrderDetail());

        OrderItem updatedOrderItem = orderItemRepository.save(existingOrderItem);
        return modelMapper.map(updatedOrderItem, OrderItemDTO.class);
    }

    @Override
    public void deleteOrderItem(Integer id) {
        if (!orderItemRepository.existsById(id)) {
            throw new RuntimeException("OrderItem not found with id: " + id);
        }
        orderItemRepository.deleteById(id);
    }
}
