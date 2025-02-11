package com.example.ECommerce.Project.V1.V1.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PaymentMethod{
    COD,
    CREDIT,
    QR
//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;
//
//    @ManyToOne(optional = false)
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    @Column(nullable = false, length = 100)
//    private String paymentMethod;
//
//    @Column(nullable = false, length = 100)
//    private String provider;
//
//    @Column(nullable = false, unique = true, length = 50)
//    private String accountNumber;
//
//    @Column(nullable = false)
//    private LocalDateTime expiredDate;

//    @Column(nullable = false, columnDefinition = "bit default 0")
//    private Boolean isDefault;
}
