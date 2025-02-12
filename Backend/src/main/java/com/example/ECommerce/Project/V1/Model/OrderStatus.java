package com.example.ECommerce.Project.V1.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatus{
    PENDING,
    APPROVED,
    REJECTED,
    DELIVERING,
    COMPLETED,
    CANCELED
}
