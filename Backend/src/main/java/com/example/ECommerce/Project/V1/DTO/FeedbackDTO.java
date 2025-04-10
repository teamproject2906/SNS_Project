package com.example.ECommerce.Project.V1.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDTO {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String subject;
    private String comment;
    private Float rate;
    private String imageUrl;
    private LocalDateTime createdAt;
}