package com.example.ECommerce.Project.V1.Service.PostService;

import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.UserLike;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IPostService {

    PostDTO createPost(String content, MultipartFile file, Principal connectedUser) throws IOException;

    PostDTO updatePost(String content, UUID postId, MultipartFile file, Principal connectedUser) throws IOException;

    void deactivatePost(PostDTO post, UUID postId, Principal connectedUser);

    List<PostDTO> getAllPostsActive();

    PostDTO getPostById(UUID postId);

    List<PostDTO> searchPostByTitle(String title);

    void likeOrDislikePost(UUID postId, Principal connectedUser);

    List<PostDTO> getUserPostByUserId(Integer userId);
}
