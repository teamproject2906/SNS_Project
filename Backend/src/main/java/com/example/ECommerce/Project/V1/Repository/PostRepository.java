package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

   List<Post> findPostByContentContainingIgnoreCase(String title);

   List<Post> findPostByContentContainingIgnoreCaseAndIsActiveTrue(String title);

   Post findPostById(UUID id);

   List<Post> findAllByIsActiveTrue();

   @Query("SELECT p.user FROM Post p WHERE p.id = :postId")
   User findUserByPostId(@Param("postId") UUID postId);

   List<Post> findPostByUserIdAndIsActive(Integer user_id, Boolean isActive);
}
