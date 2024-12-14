package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "paymentmethod")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PaymentMethod extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String paymentMethod;

    @Column(nullable = false, length = 100)
    private String provider;

    @Column(nullable = false, unique = true, length = 50)
    private String accountNumber;

    @Column(nullable = false)
    private LocalDateTime expiredDate;

    @Column(nullable = false, columnDefinition = "bit default 0")
    private Boolean isDefault;
}
