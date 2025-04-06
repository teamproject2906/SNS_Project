package com.example.ECommerce.Project.V1.DTO.AuthenticationDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String emailOrPhoneNumber;
    private String password;
}
