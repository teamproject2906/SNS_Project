package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import com.example.ECommerce.Project.V1.DTO.ResponseDTO.ResponseMessageAPI;
import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Service.CommentService.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/social/api/comment")
@RequiredArgsConstructor
public class CommentController {

   private final ICommentService commentService;

   @PostMapping("/addComment")
   public ResponseEntity<CommentDTO> addComment(
         @RequestBody CommentDTO commentDTO,
         Principal connectedUser) {
      return ResponseEntity.ok(commentService.addComment(commentDTO, connectedUser));
   }

   @PatchMapping("/updateComment/{commentId}")
   public ResponseEntity<CommentDTO> updateComment(
         @RequestBody CommentDTO commentDTO,
         @PathVariable Integer commentId,
         Principal connectedUser) {
      return ResponseEntity.ok(commentService.updateComment(commentDTO, commentId, connectedUser));
   }

   @PatchMapping("/deleteComment/{commentId}")
   public ResponseEntity<ResponseMessageAPI> deleteComment(
         @RequestBody CommentDTO commentDTO,
         @PathVariable Integer commentId,
         Principal connectedUser) {
      commentService.deactivateComment(commentDTO, commentId, connectedUser);
      ResponseMessageAPI responseMessageAPI = ResponseMessageAPI.builder()
            .message("Delete post successfully")
            .status(HttpStatus.OK)
            .success(true)
            .build();
      return new ResponseEntity<>(responseMessageAPI, HttpStatus.OK);
   }

   @GetMapping("/getCommentById/{commentId}")
   public ResponseEntity<CommentDTO> getCommentById(
         @PathVariable Integer commentId) {
      return ResponseEntity.ok(commentService.getCommentById(commentId));
   }

   @GetMapping("/getCommentsByPostId/{postId}")
   @CrossOrigin(origins = "*")
   public ResponseEntity<List<CommentDTO>> getCommentsByPostId(
         @PathVariable UUID postId) {
      List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
      return ResponseEntity.ok(comments);
   }

   @GetMapping("/getAllCommentsByPostId/{postId}")
   @CrossOrigin(origins = "*")
   public ResponseEntity<List<CommentDTO>> getAllCommentsByPostId(
         @PathVariable UUID postId) {
      List<CommentDTO> comments = commentService.getAllCommentsByPostId(postId);
      return ResponseEntity.ok(comments);
   }
}
