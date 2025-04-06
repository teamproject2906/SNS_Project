package com.example.ECommerce.Project.V1.Service.CommentService;

import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface ICommentService {
    CommentDTO addComment(CommentDTO commentDTO, Principal currentUser);
    CommentDTO updateComment(CommentDTO commentDTO, Integer cmtId, Principal currentUser);
    void deactivateComment(CommentDTO commentDTO, Integer cmtId, Principal currentUser);
    CommentDTO getCommentById(Integer id);
}
