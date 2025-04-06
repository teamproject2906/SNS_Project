package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.CommentDTO;
import com.example.ECommerce.Project.V1.DTO.ResponseDTO.ResponseMessageAPI;
import com.example.ECommerce.Project.V1.Model.Comment;
import com.example.ECommerce.Project.V1.Service.CommentService.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/social/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final ICommentService commentService;

    @PostMapping("/addComment")
    public ResponseEntity<CommentDTO> addComment(
            @RequestBody CommentDTO commentDTO,
            Principal connectedUser
    ) {
        return ResponseEntity.ok(commentService.addComment(commentDTO, connectedUser));
    }

    @PatchMapping("/updateComment/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @RequestBody CommentDTO commentDTO,
            @PathVariable Integer commentId,
            Principal connectedUser
    ){
        return ResponseEntity.ok(commentService.updateComment(commentDTO, commentId, connectedUser));
    }

    @PatchMapping("/deleteComment/{commentId}")
    public ResponseEntity<ResponseMessageAPI> deleteComment(
            @RequestBody CommentDTO commentDTO,
            @PathVariable Integer commentId,
            Principal connectedUser
    ){
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
            @PathVariable Integer commentId
    ){
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }
}
