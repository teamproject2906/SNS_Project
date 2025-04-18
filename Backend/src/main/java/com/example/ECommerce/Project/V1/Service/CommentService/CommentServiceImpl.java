package com.example.ECommerce.Project.V1.Service.CommentService;

import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.CommentRepository;
import com.example.ECommerce.Project.V1.Repository.PostRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements ICommentService {

   private final UserRepository userRepository;
   private final PostRepository postRepository;
   private final CommentRepository commentRepository;
   private final ModelMapper mapper;

   private User getCurrentUser(Principal connectedUser) {
      int userId;

      if (connectedUser instanceof JwtAuthenticationToken jwtToken) {
         Object userIdClaim = jwtToken.getToken().getClaims().get("userId");

         if (userIdClaim instanceof Number number) {
            userId = number.intValue();
         } else {
            throw new IllegalArgumentException("Invalid userId claim in JWT");
         }
      } else {
         throw new IllegalArgumentException("Unsupported principal type: " + connectedUser.getClass().getName());
      }

      return userRepository.findUserById(userId);
   }

   @Override
   public CommentDTO addComment(CommentDTO commentDTO, Principal currentUser) {
      User userFind = getCurrentUser(currentUser);
      Post postFind = postRepository.findPostById(commentDTO.getPostId());

      Comment replyComment = null;
      if (commentDTO.getCommentReplyId() != null) {
         replyComment = commentRepository.findCommentById(commentDTO.getCommentReplyId());
      }

      Comment newComment = Comment.builder()
              .user(userFind)
              .post(postFind)
              .content(commentDTO.getContent())
              .imageUrl(commentDTO.getImageUrl())
              .replyCommentId(replyComment)  // gán entity nếu có
              .createdAt(LocalDateTime.now())
              .updatedAt(LocalDateTime.now())
              .createdBy(userFind.getUsername())
              .isActive(true)
              .build();

      commentRepository.save(newComment);

      return CommentDTO.builder()
              .id(newComment.getId())
              .userId(userFind.getId())
              .firstName(userFind.getFirstname())
              .lastName(userFind.getLastname())
              .avatar(userFind.getAvatar())
              .postId(postFind.getId())
              .content(newComment.getContent())
              .imageUrl(newComment.getImageUrl())
              .commentReplyId(replyComment != null ? replyComment.getId() : null)
              .isActive(newComment.getIsActive())
              .createdAt(newComment.getCreatedAt())
              .username(userFind.getUsername())
              .build();
   }

   @Override
   public CommentDTO updateComment(CommentDTO commentDTO, Integer cmtId, Principal currentUser) {
      User userFind = getCurrentUser(currentUser);
      Post postFind = postRepository.findPostById(commentDTO.getPostId());
      var cmtFind = commentRepository.findById(cmtId)
            .orElseThrow(() -> new ResourceNotFoundException("Not found with comment ID"));
      cmtFind.setContent(commentDTO.getContent());
      cmtFind.setImageUrl(commentDTO.getImageUrl());
      cmtFind.setUpdatedAt(LocalDateTime.now());
      cmtFind.setUpdatedBy(userFind.getUsername());

      commentRepository.save(cmtFind);

      return CommentDTO.builder()
            .id(cmtFind.getId())
              .userId(userFind.getId())
              .firstName(userFind.getFirstname())
              .lastName(userFind.getLastname())
              .avatar(userFind.getAvatar())
            .postId(postFind.getId())
            .content(cmtFind.getContent())
            .imageUrl(cmtFind.getImageUrl())
            .commentReplyId(cmtFind.getId())
            .isActive(cmtFind.getIsActive())
              .createdAt(cmtFind.getCreatedAt())
              .username(userFind.getUsername())
            .build();
   }

   @Override
   public void deactivateComment(CommentDTO commentDTO, Integer cmtId, Principal currentUser) {
      User userFind = getCurrentUser(currentUser);
      var cmtFind = commentRepository.findById(cmtId)
            .orElseThrow(() -> new ResourceNotFoundException("Not found with comment ID"));
      cmtFind.setIsActive(commentDTO.isActive());
      cmtFind.setUpdatedAt(LocalDateTime.now());
      cmtFind.setUpdatedBy(userFind.getUsername());
      commentRepository.save(cmtFind);
   }

   @Override
   public CommentDTO getCommentById(Integer id) {
      var cmtFind = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Not found with comment ID"));
      return mapper.map(cmtFind, CommentDTO.class);
   }

   @Override
   public List<CommentDTO> getCommentsByPostId(UUID postId) {

      try {
         // Tìm tất cả comment cho post đã cho, không quan tâm trạng thái active
         List<Comment> comments = commentRepository.findAllByPostId(postId);


         // Map comments to DTOs
         List<CommentDTO> commentDTOs = comments.stream()
               .map(comment -> {
                  CommentDTO dto = CommentDTO.builder()
                        .id(comment.getId())
                        .userId(comment.getUser().getId())
                          .firstName(comment.getUser().getFirstname())
                          .lastName(comment.getUser().getLastname())
                          .avatar(comment.getUser().getAvatar())
                        .postId(comment.getPost().getId())
                        .content(comment.getContent())
                        .imageUrl(comment.getImageUrl())
                        .commentReplyId(comment.getReplyCommentId() != null ? comment.getReplyCommentId().getId() : null)
                        .isActive(comment.getIsActive())
                          .username(comment.getUser().getUsername())
                          .createdAt(comment.getCreatedAt())
                        .build();
                  return dto;
               })
               .collect(java.util.stream.Collectors.toList());

         return commentDTOs;
      } catch (Exception e) {
         e.printStackTrace();
         return java.util.Collections.emptyList();
      }
   }

   @Override
   public List<CommentDTO> getAllCommentsByPostId(UUID postId) {

      try {
         // Find all comments regardless of active status
         List<Comment> comments = commentRepository.findAllByPostId(postId);

         // Map comments to DTOs
         List<CommentDTO> commentDTOs = comments.stream()
               .map(comment -> {
                  CommentDTO dto = CommentDTO.builder()
                        .id(comment.getId())
                          .userId(comment.getUser().getId())
                          .firstName(comment.getUser().getFirstname())
                          .lastName(comment.getUser().getLastname())
                          .avatar(comment.getUser().getAvatar())
                        .postId(comment.getPost().getId())
                        .content(comment.getContent())
                        .imageUrl(comment.getImageUrl())
                        .commentReplyId(comment.getId())
                        .isActive(comment.getIsActive())
                          .username(comment.getUser().getUsername())
                          .createdAt(comment.getCreatedAt())
                        .build();
                  return dto;
               })
               .collect(java.util.stream.Collectors.toList());

         return commentDTOs;
      } catch (Exception e) {
         e.printStackTrace();
         return java.util.Collections.emptyList();
      }
   }
}