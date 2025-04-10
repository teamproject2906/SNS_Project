package com.example.ECommerce.Project.V1.Service.Feedback;

import com.cloudinary.Cloudinary;
import com.example.ECommerce.Project.V1.DTO.FeedbackDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Feedback;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.FeedbackRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final Cloudinary cloudinary;

    @Override
    public FeedbackDTO createFeedback(FeedbackDTO dto, MultipartFile file) throws IOException {
        // Upload ảnh lên Cloudinary
        String imageUrl = uploadImageToCloudinary(file);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Feedback feedback = Feedback.builder()
                .user(user)
                .product(product)
                .subject(dto.getSubject())
                .comment(dto.getComment())
                .rate(dto.getRate())
                .imageUrl(imageUrl)
                .build();

        feedbackRepository.save(feedback);

        return mapToDTO(feedback);
    }

    @Override
    public FeedbackDTO updateFeedback(Integer id, FeedbackDTO dto, MultipartFile file) throws IOException {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadImageToCloudinary(file);
            feedback.setImageUrl(imageUrl);
        }

        if (dto.getSubject() != null) feedback.setSubject(dto.getSubject());
        if (dto.getComment() != null) feedback.setComment(dto.getComment());
        if (dto.getRate() != null) feedback.setRate(dto.getRate());

        feedbackRepository.save(feedback);
        return mapToDTO(feedback);
    }

    @Override
    public void deleteFeedback(Integer id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        feedbackRepository.delete(feedback);
    }

    @Override
    public List<FeedbackDTO> getFeedbacksByProductId(Integer productId) {
        return feedbackRepository.findByProduct_Id(productId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ======= Helper methods ========
    private String uploadImageToCloudinary(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of(
                "folder", "feedback_images"
        ));
        return uploadResult.get("secure_url").toString();
    }

    private FeedbackDTO mapToDTO(Feedback feedback) {
        return FeedbackDTO.builder()
                .id(feedback.getId())
                .userId(feedback.getUser().getId())
                .productId(feedback.getProduct().getId())
                .subject(feedback.getSubject())
                .comment(feedback.getComment())
                .rate(feedback.getRate())
                .imageUrl(feedback.getImageUrl())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
