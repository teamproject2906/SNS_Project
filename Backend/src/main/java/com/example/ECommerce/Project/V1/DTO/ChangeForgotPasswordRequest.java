package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeForgotPasswordRequest {
    private String email;
    private String otp;
    private String newPassword;
    private String confirmPassword;
}
