package com.example.ECommerce.Project.V1.DTO;

import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private Integer id;
    private String user;
    private UUID postId;
    private String content;
    private String imageUrl;
    private Integer commentReplyId;
    private boolean isActive;
}
