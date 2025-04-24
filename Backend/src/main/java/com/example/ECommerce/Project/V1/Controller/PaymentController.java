package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.PaymentDTO;
import com.example.ECommerce.Project.V1.DTO.ResponseObject;
import com.example.ECommerce.Project.V1.Service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "Success", paymentService.createVnPayPayment(request));
    }

    @GetMapping("/vn-pay-callback")
    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String status = request.getParameter("vnp_ResponseCode");

        if ("00".equals(status)) {
            response.sendRedirect("http://localhost:5173/checkout?payment=success");
        } else {
            response.sendRedirect("http://localhost:5173/cart?payment=failed");
        }
    }

}
