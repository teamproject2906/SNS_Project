package com.example.ECommerce.Project.V1.Service.PostService;

import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.UserLike;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IPostService {
   PostDTO createPost(PostDTO post, Principal connectedUser);

   PostDTO updatePost(PostDTO post, UUID postId, Principal connectedUser);

   void deactivatePost(PostDTO post, UUID postId, Principal connectedUser);

   List<PostDTO> getAllPostsActive();

   List<PostDTO> getPostsByUID(Integer userId);

   PostDTO getPostById(UUID postId);

   List<PostDTO> searchPostByTitle(String title, Principal connectedUser);

   void likeOrDislikePost(UUID postId, Principal connectedUser);

    void reportOrUnreportPost(UUID postId, Principal connectedUser);
}
