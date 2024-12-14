package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class CategoryProductKey implements Serializable {
    private UUID productId;
    private UUID categoryId;
}
