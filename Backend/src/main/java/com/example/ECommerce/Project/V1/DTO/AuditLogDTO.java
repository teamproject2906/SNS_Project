package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class AuditLogDTO {
    private Integer id;
    private String username;
    private String tableName;
    private String actionType;
    private LocalDateTime actionTime;
    private String ipAddress;
}
