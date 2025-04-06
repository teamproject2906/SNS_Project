package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Comment findCommentById(Integer id);
}
