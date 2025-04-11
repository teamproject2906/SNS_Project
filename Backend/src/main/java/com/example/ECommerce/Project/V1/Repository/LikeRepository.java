package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Model.UserLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<UserLike, Integer> {

    Optional<UserLike> findUserLikeByUserAndPost(User user, Post post);

    @Query("SELECT COUNT(ul) FROM UserLike ul WHERE ul.post.id = :postId")
    long countByPostId(@Param("postId") UUID postId);
}
