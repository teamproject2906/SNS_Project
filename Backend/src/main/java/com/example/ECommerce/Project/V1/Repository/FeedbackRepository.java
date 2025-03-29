package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByProduct_Id(Integer productId);
}
