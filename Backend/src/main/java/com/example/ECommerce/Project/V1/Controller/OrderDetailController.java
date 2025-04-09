package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.BestSellerDTO;
import com.example.ECommerce.Project.V1.DTO.OrderDetailDTO;
import com.example.ECommerce.Project.V1.Service.BestSellerService;
import com.example.ECommerce.Project.V1.Service.OrderDetailService.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/order-details")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private BestSellerService bestSellerService;

    @GetMapping
    public List<OrderDetailDTO> getAllOrders() {
        return orderDetailService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderDetailDTO getOrderById(@PathVariable Integer id) {
        return orderDetailService.getOrderById(id);
    }

    @PostMapping
    public OrderDetailDTO createOrder(@RequestBody OrderDetailDTO orderDetailDTO) {
        return orderDetailService.createOrder(orderDetailDTO);
    }

    @PutMapping("/{id}")
    public OrderDetailDTO updateOrder(@PathVariable Integer id, @RequestBody OrderDetailDTO orderDetailDTO) {
        return orderDetailService.updateOrder(id, orderDetailDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Integer id) {
        orderDetailService.deleteOrder(id);
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<String> deactivateOrder(@PathVariable Integer id) {
        orderDetailService.deactivateOrder(id);
        return ResponseEntity.ok("OrderDetail has been deactivated successfully");
    }
    @GetMapping("/best")
    public List<BestSellerDTO> getTopBestSellers() {
        return bestSellerService.getTopBestSellers(10);
    }
}
