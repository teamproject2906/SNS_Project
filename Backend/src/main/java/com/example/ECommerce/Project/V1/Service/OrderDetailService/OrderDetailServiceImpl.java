package com.example.ECommerce.Project.V1.Service.OrderDetailService;

import com.example.ECommerce.Project.V1.DTO.OrderDetailDTO;
import com.example.ECommerce.Project.V1.DTO.OrderItemDTO;
import com.example.ECommerce.Project.V1.Model.*;
import com.example.ECommerce.Project.V1.Repository.OrderDetailRepository;
import com.example.ECommerce.Project.V1.Repository.OrderItemRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Service.OrderItemService.OrderItemService;
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

    @Autowired
    private OrderItemService orderItemService;

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
                    mapper.skip(OrderDetail::setOrderItems); // Skip setOrderItems
                });
        modelMapper.typeMap(OrderItemDTO.class, OrderItem.class)
                .addMappings(mapper -> {
                    mapper.skip(OrderItem::setOrderDetail); // Skip set id orderdetail
                });
        OrderDetail orderDetail = modelMapper.map(orderDetailDTO, OrderDetail.class);
        if (orderDetail.getOrderItems() == null) {
            orderDetail.setOrderItems(new ArrayList<>());
        }
        for (OrderItemDTO orderItemDTO: orderDetailDTO.getOrderItems()){
            OrderItem orderItem = modelMapper.map(orderItemDTO, OrderItem.class);
            orderItem.setOrderDetail(orderDetail);
            orderDetail.getOrderItems().add(orderItem);
            productService.updateProductForOrder(orderItemDTO.getProductId(), orderItemDTO.getQuantity());
        }
        orderDetail = orderDetailRepository.save(orderDetail);

        return modelMapper.map(orderDetail, OrderDetailDTO.class);
    }

    @Override
    public OrderDetailDTO updateOrder(Integer id, OrderDetailDTO orderDetailDTO) {
        // Lấy đối tượng OrderDetail từ cơ sở dữ liệu
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Cập nhật các trường của OrderDetail ngoại trừ orderItems để tránh ghi đè collection ban đầu
        orderDetail.setTotalAmount(orderDetailDTO.getTotalAmount());
        orderDetail.setOrderDate(orderDetailDTO.getOrderDate());
        orderDetail.setShippingDate(orderDetailDTO.getShippingDate());
        orderDetail.setOrderStatus(OrderStatus.valueOf(orderDetailDTO.getOrderStatus()));
        orderDetail.setPaymentMethod(PaymentMethod.valueOf(orderDetailDTO.getPaymentMethod()));
        // Nếu có các trường khác cần cập nhật, hãy làm tương tự

        // Cập nhật từng OrderItem đã có trong OrderDetail
        for (OrderItemDTO orderItemDTO : orderDetailDTO.getOrderItems()) {
            // Tìm OrderItem tương ứng trong collection hiện có của OrderDetail
            OrderItem orderItem = orderDetail.getOrderItems().stream()
                    .filter(item -> item.getId().equals(orderItemDTO.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Order item not found in OrderDetail"));

            // Tính toán sự thay đổi số lượng và cập nhật sản phẩm tương ứng
            int originalOrderQuantity = orderItem.getQuantity();
            productService.updateProductForOrder(orderItemDTO.getProductId(),
                    orderItemDTO.getQuantity() - originalOrderQuantity);

            // Cập nhật OrderItem theo DTO (bạn có thể tự cập nhật các thuộc tính cần thiết tại đây)
            orderItemService.updateOrderItem(orderItemDTO.getId(), orderItemDTO);
        }

        // Lưu lại các thay đổi của OrderDetail (vẫn giữ nguyên tham chiếu của collection orderItems)
        orderDetail = orderDetailRepository.save(orderDetail);

        // Chuyển đổi entity thành DTO để trả về
        return modelMapper.map(orderDetail, OrderDetailDTO.class);
    }

    public void deactivateOrder(Integer id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Đảo ngược trạng thái isActive
        orderDetail.setIsActive(false);

        // Lưu lại vào database
        orderDetailRepository.save(orderDetail);
    }
    @Override
    public void deleteOrder(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}
