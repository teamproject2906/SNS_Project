package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String imageUrl;    // trả về sau khi upload
}
