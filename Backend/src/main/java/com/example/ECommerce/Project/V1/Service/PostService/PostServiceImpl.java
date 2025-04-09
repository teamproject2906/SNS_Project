package com.example.ECommerce.Project.V1.Service.PostService;

import com.cloudinary.Cloudinary;
import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.DTO.UserLikeDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Model.UserLike;
import com.example.ECommerce.Project.V1.Repository.LikeRepository;
import com.example.ECommerce.Project.V1.Repository.PostRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

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
    public PostDTO createPost(PostDTO post, MultipartFile file, Principal connectedUser) throws IOException {

        User userFind = getCurrentUser(connectedUser);

        Map<String, Object> options = new HashMap<>();
        options.put("folder", "social");
        options.put("tags", List.of("post_img"));

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        String imageUrl = uploadResult.get("secure_url").toString();

        var newPost = Post.builder()
                .user(userFind)
                .content(post.getContent())
                .imageUrl(imageUrl)
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
                .build();
    }

    @Override
    public PostDTO updatePost(PostDTO post, UUID postId, MultipartFile file, Principal connectedUser) throws IOException {

        User userFind = getCurrentUser(connectedUser);

        Post updatedPost = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // If a new image is uploaded
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            String oldImageUrl = updatedPost.getImageUrl();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String publicId = extractPublicIdFromUrl(oldImageUrl);
                cloudinary.uploader().destroy(publicId, Map.of());
            }

            Map<String, Object> options = new HashMap<>();
            options.put("folder", "social");
            options.put("tags", List.of("post_img"));

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            imageUrl = uploadResult.get("secure_url").toString();
        }


        updatedPost.setContent(post.getContent());
        updatedPost.setImageUrl(imageUrl);
        updatedPost.setUpdatedAt(LocalDateTime.now());
        updatedPost.setUpdatedBy(userFind.getUsername());

        postRepository.save(updatedPost);

        return PostDTO.builder()
                .id(updatedPost.getId())
                .user(userFind.getFirstname() + " " + userFind.getLastname())
                .content(updatedPost.getContent())
                .imageUrl(updatedPost.getImageUrl())
                .build();
    }

    @Override
    public void deactivatePost(PostDTO post, UUID postId, Principal connectedUser) {

        User userFind = getCurrentUser(connectedUser);

        Post updatedPost = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
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
                .build();
    }

    @Override
    public List<PostDTO> searchPostByTitle(String content) {
        List<Post> posts = postRepository.findPostByContentContainingIgnoreCase(content);
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
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public void likeOrDislikePost(UUID postId, Principal connectedUser) {

        User userFind = getCurrentUser(connectedUser);

        Post post = postRepository.findPostById(postId);
        var findUserLikePost = likeRepository.findUserLikeByUserAndPost(userFind, post);
        if (findUserLikePost.isEmpty()){
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
    public List<PostDTO> getUserPostByUserId(Integer userId) {

        List<Post> posts = postRepository.findPostByUserId(userId);

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
                            .build();
                })
                .collect(Collectors.toList());
    }

    private CommentDTO convertToCommentDTO(Comment comment) {

        return CommentDTO.builder()
                .id(comment.getId())
                .user(comment.getUser().getFirstname() + " " + comment.getUser().getLastname())
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
                .build();
    }

    private String extractPublicIdFromUrl(String url) {
        try {
            String[] parts = url.split("/");
            int index = Arrays.asList(parts).indexOf("upload");
            if (index != -1 && index + 1 < parts.length) {
                // Join everything after 'upload' (skip version and extract public_id without extension)
                StringBuilder publicIdBuilder = new StringBuilder();
                for (int i = index + 2; i < parts.length; i++) {
                    String part = parts[i];
                    if (i == parts.length - 1) {
                        part = part.substring(0, part.lastIndexOf('.')); // remove .jpg/.png
                    }
                    publicIdBuilder.append(part);
                    if (i < parts.length - 1) publicIdBuilder.append("/");
                }
                return publicIdBuilder.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
