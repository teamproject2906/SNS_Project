package com.example.ECommerce.Project.V1.DTO;

import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Model.UserLike;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    private UUID id;
    private String user;
    private String content;
    private String imageUrl;
    private List<CommentDTO> comments;
    private long totalLiked;
    private List<UserLikeDTO> userLikes;
    private boolean isActive;
}
