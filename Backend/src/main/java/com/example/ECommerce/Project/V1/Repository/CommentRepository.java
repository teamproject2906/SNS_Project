package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
   Comment findCommentById(Integer id);

   // Add method to find all comments by post and active status
   List<Comment> findAllByPostAndIsActiveTrue(Post post);

   // Add method to find all comments by postId
   List<Comment> findAllByPost_IdAndIsActiveTrue(java.util.UUID postId);

   // Add method to find all comments by postId regardless of active status
   @Query("SELECT c FROM Comment c WHERE c.post.id = :postId")
   List<Comment> findAllByPostId(@Param("postId") UUID postId);

   List<Comment> findCommentsByReplyCommentId(Comment comment);
}