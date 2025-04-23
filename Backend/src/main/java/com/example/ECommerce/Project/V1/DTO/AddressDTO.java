package com.example.ECommerce.Project.V1.DTO;

import lombok.Data;

@Data
public class AddressDTO {
    private Integer id;
    private String addressDescription;
    private String addressDetail;
    private String ward;
    private String district;
    private String province;
    private String country;
    private String phoneNumber;
    private Boolean isDefault;
    private Integer userId;
}