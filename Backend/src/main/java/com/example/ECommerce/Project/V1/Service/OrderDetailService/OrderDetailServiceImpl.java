package com.example.ECommerce.Project.V1.Service.OrderDetailService;

import com.example.ECommerce.Project.V1.DTO.OrderDetailDTO;
import com.example.ECommerce.Project.V1.DTO.OrderItemDTO;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Model.*;
import com.example.ECommerce.Project.V1.Repository.OrderDetailRepository;
import com.example.ECommerce.Project.V1.Repository.OrderItemRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Service.BestSellerService;
import com.example.ECommerce.Project.V1.Service.OrderItemService.OrderItemService;
import com.example.ECommerce.Project.V1.Service.ProductService.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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

    @Autowired
    private BestSellerService bestSellerService;

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

    public void validateOrderDetailDTO(OrderDetailDTO orderDetailDTO) {
        String VALID_ORDER_STATUSES = Arrays.stream(OrderStatus.values())
                .map(Enum::name)
                .collect(Collectors.joining(", "));
        String VALID_PAYMENT_METHODS = Arrays.stream(PaymentMethod.values())
                .map(Enum::name)
                .collect(Collectors.joining(", "));
        // Kiểm tra các trường bắt buộc không null
        if (orderDetailDTO.getUserId() == null) {
            throw new InvalidInputException("User ID cannot be null");
        }

        if (orderDetailDTO.getOrderItems() == null || orderDetailDTO.getOrderItems().isEmpty()) {
            throw new InvalidInputException("Order items cannot be null or empty");
        }

        if (orderDetailDTO.getOrderStatus() == null || orderDetailDTO.getOrderStatus().isEmpty()) {
            throw new InvalidInputException("Order status cannot be null or empty");
        }

        if (orderDetailDTO.getPaymentMethod() == null || orderDetailDTO.getPaymentMethod().isEmpty()) {
            throw new InvalidInputException("Payment method cannot be null or empty");
        }

        // Kiểm tra orderItems
        for (int i = 0; i < orderDetailDTO.getOrderItems().size(); i++) {
            var item = orderDetailDTO.getOrderItems().get(i);
            if (item.getProductId() == null) {
                throw new InvalidInputException("Product ID in order item " + i + " cannot be null");
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new InvalidInputException("Quantity in order item " + i + " must be greater than 0");
            }
        }

        // Kiểm tra orderStatus hợp lệ
        try {
            OrderStatus.valueOf(orderDetailDTO.getOrderStatus());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid order status: " + orderDetailDTO.getOrderStatus() + ". Valid values are: " + VALID_ORDER_STATUSES);
        }

        // Kiểm tra paymentMethod hợp lệ
        try {
            PaymentMethod.valueOf(orderDetailDTO.getPaymentMethod());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid payment method: " + orderDetailDTO.getPaymentMethod() + ". Valid values are: " + VALID_PAYMENT_METHODS);
        }

        // Kiểm tra totalAmount (nếu không null)
        if (orderDetailDTO.getTotalAmount() != null && orderDetailDTO.getTotalAmount() <= 0) {
            throw new InvalidInputException("Total amount must be greater than 0");
        }

        // Kiểm tra shippingDate (nếu có) phải sau orderDate
        if (orderDetailDTO.getOrderDate() != null && orderDetailDTO.getShippingDate() != null) {
            if (orderDetailDTO.getShippingDate().isBefore(orderDetailDTO.getOrderDate())) {
                throw new InvalidInputException("Shipping date must be after order date");
            }
        }
    }
    @Override
    public OrderDetailDTO createOrder(OrderDetailDTO orderDetailDTO) {
        validateOrderDetailDTO(orderDetailDTO);
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

        if(Objects.equals(orderDetailDTO.getOrderStatus(), "COMPLETED")){
            for (OrderItem orderItem : orderDetail.getOrderItems()) {
                bestSellerService.updateBestSellerQuantity(orderItem.getProduct().getId());
            }
        }
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
        // Nếu trạng thái mới là COMPLETED, cập nhật BestSeller
        if (Objects.equals(orderDetailDTO.getOrderStatus(), "COMPLETED")) {
            for (OrderItem orderItem : orderDetail.getOrderItems()) {
                bestSellerService.updateBestSellerQuantity(orderItem.getProduct().getId());
            }
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
