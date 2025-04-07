package com.example.ECommerce.Project.V1.Service.Feedback;

import com.example.ECommerce.Project.V1.DTO.FeedbackDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FeedbackService {
    FeedbackDTO createFeedback(FeedbackDTO dto, MultipartFile file) throws IOException;
    FeedbackDTO updateFeedback(Integer id, FeedbackDTO dto, MultipartFile file) throws IOException;
    void deleteFeedback(Integer id);
    List<FeedbackDTO> getFeedbacksByProductId(Integer productId);
}
