package com.example.ECommerce.Project.V1.Service;

import com.example.ECommerce.Project.V1.Config.VNPAYConfig;
import com.example.ECommerce.Project.V1.DTO.PaymentDTO;
import com.example.ECommerce.Project.V1.Util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final VNPAYConfig vnPayConfig;
    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request) {
        // Validate amount
        String amountStr = request.getParameter("amount");
        if (amountStr == null || amountStr.isEmpty()) {
            throw new IllegalArgumentException("Amount cannot be null or empty");
        }
        long amount;
        try {
            amount = Integer.parseInt(amountStr) * 100L;
        } catch (NumberFormatException e) {
            throw new NumberFormatException("Invalid amount format");
        }
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }
}
