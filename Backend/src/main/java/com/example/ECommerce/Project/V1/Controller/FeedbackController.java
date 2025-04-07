package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.FeedbackDTO;
import com.example.ECommerce.Project.V1.Service.Feedback.FeedbackService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<?> createFeedback(
            @RequestPart("dto") String dtoJson,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        FeedbackDTO dto = objectMapper.readValue(dtoJson, FeedbackDTO.class);

        FeedbackDTO created = feedbackService.createFeedback(dto, file);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<FeedbackDTO> updateFeedback(
            @PathVariable Integer id,
            @RequestPart("dto") String dtoJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        FeedbackDTO dto = objectMapper.readValue(dtoJson, FeedbackDTO.class);
        FeedbackDTO updated = feedbackService.updateFeedback(id, dto, file);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Integer id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<FeedbackDTO>> getByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByProductId(productId));
    }
}

