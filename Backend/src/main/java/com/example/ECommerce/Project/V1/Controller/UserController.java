package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import com.example.ECommerce.Project.V1.Service.UserService.IUserService;
import com.example.ECommerce.Project.V1.Service.VoucherService.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/User")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final VoucherService voucherService;

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ){
        userService.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/changeForgotPassword")
    public ResponseEntity<?> changeForgotPassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ){
        userService.changeForgotPassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateUserInfo(
            @RequestBody UserDTO userDTO,
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDto = userService.updateUserInfo(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("/findUserId/{username}")
    public Integer findUsername(
            @Valid @RequestBody UserDTO userDTO,
            @PathVariable("username") String username,
            Principal connectedUser
    ){
        return userService.findUserIdByUsername(userDTO, username);
    }

    @PostMapping("/updateAvt/{userId}")
    public ResponseEntity<?> updateUserAvatar(
            @PathVariable("userId") Integer userId,
            @RequestParam("file") MultipartFile file,
            Principal connectedUser
    ) {
        try {
            UserDTO userDto = userService.updateUserAvatar(userId, file);
            return new ResponseEntity<>(userDto.getAvatar(), HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PatchMapping("/changeEmail/{userId}")
    public ResponseEntity<?> changeEmail(
            @Valid @RequestBody UserDTO userDTO,
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDto = userService.changeEmail(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("/changePhone/{userId}")
    public ResponseEntity<?> changePhoneNumber(
            @Valid @RequestBody UserDTO userDTO,
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDto = userService.changePhoneNumber(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping("/getUserProfile/{userId}")
    public ResponseEntity<?> getUserProfile(
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDTO = userService.getUserProfile(userId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/getAllUser")
    public ResponseEntity<List<UserDTO>> getAllUser(
//            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
//            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
//            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
//            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
    ){
        List<UserDTO> pageableResponse = userService.getAllUsers();
        return new ResponseEntity<>(pageableResponse, HttpStatus.OK);
    }

    @PatchMapping("/banUser/{userId}")
    public ResponseEntity<?> banUser(
            @PathVariable Integer userId,
            @Valid @RequestBody UserDTO userDTO,
            Principal connectedUser
    ){
        UserDTO userDto = userService.banOrUbanUser(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("/setUserRole/{userId}")
    public ResponseEntity<?> setUserRole(
            @PathVariable Integer userId,
            @Valid @RequestBody UserDTO userDTO,
            Principal connectedUser
    ){
        UserDTO userDto = userService.setUserRole(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> searchUserByUsername(
//            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
//            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
//            @RequestParam(value = "sortBy", defaultValue = "username", required = false) String sortBy,
//            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @PathVariable String keyword
    ){
        List<UserDTO> pageableResponse = userService.searchUserByUsername(keyword);
        return new ResponseEntity<>(pageableResponse, HttpStatus.OK);
    }
}
