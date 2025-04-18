package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private Integer id;
    private Integer userId;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private UUID postId;
    private String content;
    private String imageUrl;
    private Integer commentReplyId;
    private boolean isActive;
    private LocalDateTime createdAt;
}
