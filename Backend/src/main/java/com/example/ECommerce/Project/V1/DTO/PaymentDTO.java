package com.example.ECommerce.Project.V1.DTO;

import lombok.Builder;
import lombok.Getter;

public abstract class PaymentDTO {

    @Getter
    @Builder
    public static class VNPayResponse {
        private String code;
        private String message;
        private String paymentUrl;
    }
}
