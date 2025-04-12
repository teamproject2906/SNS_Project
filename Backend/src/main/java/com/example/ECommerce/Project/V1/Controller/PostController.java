package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.DTO.ResponseDTO.ResponseMessageAPI;
import com.example.ECommerce.Project.V1.Service.PostService.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/social/api/post")
@RequiredArgsConstructor
public class PostController {

    private final IPostService postService;

    @GetMapping("/getAllPostActive")
    public ResponseEntity<List<PostDTO>> getAllPostsActive() {
        return ResponseEntity.ok(postService.getAllPostsActive());
    }

    @PostMapping("/createPost")
    public ResponseEntity<PostDTO> createPost(
            @RequestParam("content") String content,
            @RequestParam("file") MultipartFile file,
            Principal connectedUser
    ) throws IOException {
        return ResponseEntity.ok(postService.createPost(content, file, connectedUser));
    }

    @PutMapping("/updatePost")
    public ResponseEntity<PostDTO> updatePost(
            @RequestParam("content") String content,
            @RequestParam("postId") UUID postId,
            @RequestParam("file") MultipartFile file,
            Principal connectedUser
    ) throws IOException {

        if (file.getSize() > 1){
            throw new RuntimeException("You cannot upload more than one file for each post");
        }

        return ResponseEntity.ok(postService.updatePost(content, postId, file, connectedUser));
    }

    @PatchMapping("/deactivatePost/{postId}")
    public ResponseEntity<ResponseMessageAPI> deletePost(
            @RequestBody PostDTO postDTO,
            @PathVariable UUID postId,
            Principal connectedUser
    ) {
        postService.deactivatePost(postDTO, postId, connectedUser);
        ResponseMessageAPI responseMessageAPI = ResponseMessageAPI.builder()
                .message("Delete post successfully")
                .status(HttpStatus.OK)
                .success(true)
                .build();
        return new ResponseEntity<>(responseMessageAPI, HttpStatus.OK);
    }

    @GetMapping("/getPostById/{postId}")
    public ResponseEntity<PostDTO> getPostById(
            @PathVariable UUID postId
    ){
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @GetMapping("/searchPost/{content}")
    public ResponseEntity<List<PostDTO>> getPostsByTitle(
            @PathVariable String content
    ){
        return ResponseEntity.ok(postService.searchPostByTitle(content));
    }

    @PostMapping("/likePost/{postId}")
    public ResponseEntity<ResponseMessageAPI> likePost(
            @PathVariable UUID postId,
            Principal connectedUser
    ){
        postService.likeOrDislikePost(postId, connectedUser);
        ResponseMessageAPI responseMessageAPI = ResponseMessageAPI.builder()
                .message("Like/Dislike post successfully")
                .status(HttpStatus.OK)
                .success(true)
                .build();
        return new ResponseEntity<>(responseMessageAPI, HttpStatus.OK);
    }

    @GetMapping("/getUserPostByUserId/{userId}")
    public ResponseEntity<List<PostDTO>> getUserPostByUserId(
            @PathVariable Integer userId,
            Principal connectedUser
    ){
        return ResponseEntity.ok(postService.getUserPostByUserId(userId));
    }
}
