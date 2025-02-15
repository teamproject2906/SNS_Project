package com.example.ECommerce.Project.V1.Service.OrderDetailService;

import com.example.ECommerce.Project.V1.DTO.OrderDetailDTO;
import com.example.ECommerce.Project.V1.DTO.OrderItemDTO;
import com.example.ECommerce.Project.V1.Model.OrderDetail;
import com.example.ECommerce.Project.V1.Model.OrderItem;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Repository.OrderDetailRepository;
import com.example.ECommerce.Project.V1.Repository.OrderItemRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Service.ProductService.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IProductService productService;

    @Override
    public List<OrderDetailDTO> getAllOrders() {
        return orderDetailRepository.findAll()
                .stream()
                .map(order -> modelMapper.map(order, OrderDetailDTO.class))
                .collect(Collectors.toList());
    }


    @Override
    public OrderDetailDTO getOrderById(Integer id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return modelMapper.map(orderDetail, OrderDetailDTO.class);
    }

    @Override
    public OrderDetailDTO createOrder(OrderDetailDTO orderDetailDTO) {
        modelMapper.typeMap(OrderDetailDTO.class, OrderDetail.class)
                .addMappings(mapper -> {
                    mapper.skip(OrderDetail::setId); // Skip setId
//                    mapper.skip(OrderDetail::setOrderItems); // Skip setOrderItems
                });
//        modelMapper.typeMap(OrderItemDTO.class, OrderItem.class)
//                .addMappings(mapper -> {
//                    mapper.skip(OrderItem::setOrderDetail); // Skip set id orderdetail
//                    mapper.skip(OrderItem::setProduct);
//                });
        OrderDetail orderDetail = modelMapper.map(orderDetailDTO, OrderDetail.class);
        orderDetail = orderDetailRepository.save(orderDetail);

//        List <OrderItem> listNewOrderItems = new ArrayList<>();
//        OrderDetail newOrder = orderDetailRepository.findLastInsertedOrder();
//        for (OrderItemDTO orderItemDTO: orderDetailDTO.getOrderItems()){
//            OrderItem orderItem = new OrderItem();
//            Product orderProduct = productRepository.findProductById(orderItemDTO.getProductId());
//            orderItem.setId(orderItemDTO.getId());
//            orderItem.setProduct(orderProduct);
//            orderItem.setOrderDetail(newOrder);
//            orderItem.setQuantity(orderItemDTO.getQuantity());
//            orderItemRepository.save(orderItem);
//            listNewOrderItems.add(orderItem);
//        }
//        newOrder.setOrderItems(listNewOrderItems);
//        orderDetailRepository.save(newOrder);
        return modelMapper.map(orderDetail, OrderDetailDTO.class);
    }

    @Override
    public OrderDetailDTO updateOrder(Integer id, OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = orderDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        modelMapper.map(orderDetailDTO, orderDetail);
        orderDetail = orderDetailRepository.save(orderDetail);
        return modelMapper.map(orderDetail, OrderDetailDTO.class);
    }

    @Override
    public void deleteOrder(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}
