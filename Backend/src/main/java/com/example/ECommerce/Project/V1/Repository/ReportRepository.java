package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Post;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Model.UserLike;
import com.example.ECommerce.Project.V1.Model.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<UserReport, Integer> {

    Optional<UserReport> findUserReportByUserAndPost(User user, Post post);

    @Query("SELECT COUNT(ur) FROM UserReport ur WHERE ur.post.id = :postId")
    long countReportByPostId(@Param("postId") UUID postId);
}
