package com.example.ECommerce.Project.V1.Service.PostService;

import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.DTO.UserLikeDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.*;
import com.example.ECommerce.Project.V1.Repository.*;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService {

   private final PostRepository postRepository;
   private final ModelMapper mapper;
   private final LikeRepository likeRepository;
   private final UserRepository userRepository;
   private final CommentRepository commentRepository;
   private final ReportRepository reportRepository;

   @Override
   public PostDTO createPost(PostDTO post, Principal connectedUser) {
      // Validate content
      if (post.getContent() == null || post.getContent().trim().isEmpty()) {
         throw new IllegalArgumentException("Content cannot be empty");
      }

      // Get current user
      User userFind = userRepository.findUserById(post.getUserId());
      if (userFind == null) {
         throw new ResourceNotFoundException("User not found");
      }

      var newPost = Post.builder()
            .user(userFind)
            .content(post.getContent())
            .imageUrl(post.getImageUrl())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .createdBy(userFind.getUsername())
            .updatedBy(userFind.getUsername())
            .isActive(true)
            .build();
      postRepository.save(newPost);

      return PostDTO.builder()
            .id(newPost.getId())
            .user(userFind.getFirstname() + " " + userFind.getLastname())
            .content(newPost.getContent())
            .imageUrl(newPost.getImageUrl())
            .userId(userFind.getId())
            .userAvatar(userFind.getAvatar())
            .build();
   }

   @Override
   public PostDTO updatePost(PostDTO post, UUID postId, Principal connectedUser) {

      // Get current user
      User userFind = userRepository.findUserById(post.getUserId());
      if (userFind == null) {
         throw new ResourceNotFoundException("User not found");
      }

      Post updatedPost = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
      updatedPost.setContent(post.getContent());
      updatedPost.setImageUrl(post.getImageUrl());
      updatedPost.setUpdatedAt(LocalDateTime.now());
      updatedPost.setUpdatedBy(userFind.getUsername());

      postRepository.save(updatedPost);

      return PostDTO.builder()
            .id(updatedPost.getId())
            .user(userFind.getFirstname() + " " + userFind.getLastname())
            .content(updatedPost.getContent())
            .imageUrl(updatedPost.getImageUrl())
            .userId(userFind.getId())
            .userAvatar(userFind.getAvatar())
            .build();
   }

   @Override
   public void deactivatePost(PostDTO post, UUID postId, Principal connectedUser) {

      // Get current user
      User userFind = userRepository.findUserById(post.getUserId());
      if (userFind == null) {
         throw new ResourceNotFoundException("User not found");
      }

      Post updatedPost = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
      updatedPost.setIsActive(post.isActive());
      updatedPost.setUpdatedAt(LocalDateTime.now());
      updatedPost.setUpdatedBy(userFind.getUsername());
      postRepository.save(updatedPost);
   }

   @Override
   public List<PostDTO> getAllPostsActive() {
      List<Post> posts = postRepository.findAllByIsActiveTrue();

      return posts.stream()
              .sorted(Comparator.comparing(Post::getCreatedAt).reversed())
            .map(post -> {
               User userFind = postRepository.findUserByPostId(post.getId());
               long totalLikes = likeRepository.countLikeByPostId(post.getId());
               long totalReports = reportRepository.countReportByPostId(post.getId());
               String fullName = (userFind.getFirstname() != null && userFind.getLastname() != null)
                       ? userFind.getFirstname() + " " + userFind.getLastname()
                       : null;
               return PostDTO.builder()
                     .id(post.getId())
                     .user(fullName)
                       .username(userFind.getUsername())
                     .content(post.getContent())
                     .imageUrl(post.getImageUrl())
                     .comments(post.getComments()
                           .stream()
                           .map(this::convertToCommentDTO)
                           .collect(Collectors.toList()))
                     .userLikes(post.getLikes()
                           .stream()
                           .map(this::convertToUserLikeDTO)
                           .collect(Collectors.toList()))
                     .totalLiked(totalLikes)
                     .totalReported(totalReports)
                     .userId(userFind.getId())
                     .userAvatar(userFind.getAvatar())
                       .createdAt(post.getCreatedAt())
                       .updatedAt(post.getUpdatedAt())
                     .build();
            })
            .collect(Collectors.toList());
   }

   @Override
   public PostDTO getPostById(UUID postId) {
      Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
      User userFind = postRepository.findUserByPostId(post.getId());
      long totalLikes = likeRepository.countLikeByPostId(post.getId());
      long totalReports = reportRepository.countReportByPostId(post.getId());
      String fullName = (userFind.getFirstname() != null && userFind.getLastname() != null)
              ? userFind.getFirstname() + " " + userFind.getLastname()
              : null;
      return PostDTO.builder()
            .id(post.getId())
            .user(fullName)
              .username(userFind.getUsername())
            .content(post.getContent())
            .imageUrl(post.getImageUrl())
            .comments(post.getComments()
                  .stream()
                  .map(this::convertToCommentDTO)
                  .collect(Collectors.toList()))
            .userLikes(post.getLikes()
                  .stream()
                  .map(this::convertToUserLikeDTO)
                  .collect(Collectors.toList()))
            .totalLiked(totalLikes)
              .totalReported(totalReports)
            .userId(userFind.getId())
            .userAvatar(userFind.getAvatar())
              .createdAt(post.getCreatedAt())
              .updatedAt(post.getUpdatedAt())
            .build();
   }

   @Override
   public List<PostDTO> getPostsByUID(Integer userId) {
      List<Post> postsByUserId = postRepository.findPostByUserIdAndIsActive(userId, true);
      User userFind = userRepository.findUserById(userId);

      String fullName = (userFind.getFirstname() != null && userFind.getLastname() != null)
              ? userFind.getFirstname() + " " + userFind.getLastname()
              : null;

      return postsByUserId.stream()
              .sorted(Comparator.comparing(Post::getCreatedAt).reversed())
              .map(post -> {
         long totalLikes = likeRepository.countLikeByPostId(post.getId());
         long totalReports = reportRepository.countReportByPostId(post.getId());
         return PostDTO.builder()
                 .id(post.getId())
                 .user(fullName)
                 .username(userFind.getUsername())
                 .content(post.getContent())
                 .imageUrl(post.getImageUrl())
                 .comments(post.getComments()
                         .stream()
                         .map(this::convertToCommentDTO)
                         .collect(Collectors.toList()))
                 .userLikes(post.getLikes()
                         .stream()
                         .map(this::convertToUserLikeDTO)
                         .collect(Collectors.toList()))
                 .totalLiked(totalLikes)
                 .totalReported(totalReports)
                 .userId(userFind.getId())
                 .userAvatar(userFind.getAvatar())
                 .createdAt(post.getCreatedAt())
                 .updatedAt(post.getUpdatedAt())
                 .build();
      }).collect(Collectors.toList());
   }


   @Override
   public List<PostDTO> searchPostByTitle(String content, Integer userId, Principal connectedUser) {
      List<Post> posts;
      // Kiểm tra vai trò của người dùng
      if (connectedUser != null) {
         // Get current user
         User userFind = userRepository.findUserById(userId);
         if (userFind == null) {
            throw new ResourceNotFoundException("User not found");
         }
         boolean isAdmin = userFind.getRole() == Role.ADMIN;

         // Admin có thể xem tất cả các bài post (cả active và inactive)
         if (isAdmin) {
            posts = postRepository.findPostByContentContainingIgnoreCase(content);
         } else {
            // User thường chỉ có thể xem các bài post active
            posts = postRepository.findPostByContentContainingIgnoreCaseAndIsActiveTrue(content);
         }
      } else {
         // Nếu không đăng nhập, chỉ xem được bài viết active
         posts = postRepository.findPostByContentContainingIgnoreCaseAndIsActiveTrue(content);
      }

      return posts.stream()
            .map(post -> {
               User userFind = postRepository.findUserByPostId(post.getId());
               long totalLikes = likeRepository.countLikeByPostId(post.getId());
               long totalReports = reportRepository.countReportByPostId(post.getId());
               return PostDTO.builder()
                     .id(post.getId())
                     .user(userFind.getFirstname() + " " + userFind.getLastname())
                     .content(post.getContent())
                     .imageUrl(post.getImageUrl())
                     .isActive(post.getIsActive())
                     .comments(post.getComments()
                           .stream()
                           .map(this::convertToCommentDTO)
                           .collect(Collectors.toList()))
                     .userLikes(post.getLikes()
                           .stream()
                           .map(this::convertToUserLikeDTO)
                           .collect(Collectors.toList()))
                     .totalLiked(totalLikes)
                     .totalReported(totalReports)
                     .userId(userFind.getId())
                     .userAvatar(userFind.getAvatar())
                       .createdAt(post.getCreatedAt())
                       .updatedAt(post.getUpdatedAt())
                     .build();
            })
            .collect(Collectors.toList());
   }

   @Override
   public void likeOrDislikePost(UUID postId, Integer userId, Principal connectedUser) {

      // Get current user
      User userFind = userRepository.findUserById(userId);
      if (userFind == null) {
         throw new ResourceNotFoundException("User not found");
      }

      Post post = postRepository.findPostById(postId);
      var findUserLikePost = likeRepository.findUserLikeByUserAndPost(userFind, post);
      if (findUserLikePost.isEmpty()) {
         var userLiked = UserLike.builder()
               .user(userFind)
               .post(post)
               .build();
         likeRepository.save(userLiked);
      } else {
         likeRepository.delete(findUserLikePost.get());
      }
   }

   @Override
   public void reportOrUnreportPost(UUID postId, Integer userId, Principal connectedUser) {
      // Get current user
      User userFind = userRepository.findUserById(userId);
      if (userFind == null) {
         throw new ResourceNotFoundException("User not found");
      }

      Post post = postRepository.findPostById(postId);
      var findUserReportPost = reportRepository.findUserReportByUserAndPost(userFind, post);
      if (findUserReportPost.isEmpty()) {
         var userReported = UserReport.builder()
                 .user(userFind)
                 .post(post)
                 .build();
         reportRepository.save(userReported);
      } else {
         reportRepository.delete(findUserReportPost.get());
      }
   }

   private CommentDTO convertToCommentDTO(Comment comment) {

      return CommentDTO.builder()
            .id(comment.getId())
              .userId(comment.getUser().getId())
              .firstName(comment.getUser().getFirstname())
              .lastName(comment.getUser().getLastname())
              .avatar(comment.getUser().getAvatar())
            .postId(comment.getPost() != null ? comment.getPost().getId() : null)
            .content(comment.getContent())
            .imageUrl(comment.getImageUrl())
            .commentReplyId(comment.getId())
            .isActive(comment.getIsActive())
            .build();
   }

   private UserLikeDTO convertToUserLikeDTO(UserLike userLike) {
      if (userLike == null) {
         return null;
      }

      return UserLikeDTO.builder()
            .userID(userLike.getUser().getId())
            .postID(userLike.getPost().getId())
              .fullName(userLike.getUser().getFirstname() + " " + userLike.getUser().getLastname())
              .avatar(userLike.getUser().getAvatar())
            .build();
   }
}
