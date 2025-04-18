package com.example.ECommerce.Project.V1.Service.PostService;

import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.DTO.UserLikeDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Model.UserLike;
import com.example.ECommerce.Project.V1.Repository.CommentRepository;
import com.example.ECommerce.Project.V1.Repository.LikeRepository;
import com.example.ECommerce.Project.V1.Repository.PostRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
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
   public PostDTO createPost(PostDTO post, Principal connectedUser) {

      User userFind = getCurrentUser(connectedUser);

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

      User userFind = getCurrentUser(connectedUser);

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

      User userFind = getCurrentUser(connectedUser);

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
            .map(post -> {
               User userFind = postRepository.findUserByPostId(post.getId());
               long totalLikes = likeRepository.countByPostId(post.getId());
               return PostDTO.builder()
                     .id(post.getId())
                     .user(userFind.getFirstname() + " " + userFind.getLastname())
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
                     .userId(userFind.getId())
                     .userAvatar(userFind.getAvatar())
                     .build();
            })
            .collect(Collectors.toList());
   }

   @Override
   public PostDTO getPostById(UUID postId) {
      Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
      User userFind = postRepository.findUserByPostId(post.getId());
      long totalLikes = likeRepository.countByPostId(post.getId());
      return PostDTO.builder()
            .id(post.getId())
            .user(userFind.getFirstname() + " " + userFind.getLastname())
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
            .userId(userFind.getId())
            .userAvatar(userFind.getAvatar())
            .build();
   }

   @Override
   public List<PostDTO> searchPostByTitle(String content, Principal connectedUser) {
      List<Post> posts;
      // Kiểm tra vai trò của người dùng
      if (connectedUser != null) {
         User userFind = getCurrentUser(connectedUser);
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
               long totalLikes = likeRepository.countByPostId(post.getId());
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
                     .userId(userFind.getId())
                     .userAvatar(userFind.getAvatar())
                     .build();
            })
            .collect(Collectors.toList());
   }

   @Override
   public void likeOrDislikePost(UUID postId, Principal connectedUser) {

      User userFind = getCurrentUser(connectedUser);

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
