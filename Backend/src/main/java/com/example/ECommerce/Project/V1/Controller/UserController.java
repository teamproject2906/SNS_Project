package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import com.example.ECommerce.Project.V1.Service.UserService.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/User")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ){
        userService.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/update/{userId}")
    public ResponseEntity<?> updateUserInfo(
            @RequestBody UserDTO userDTO,
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDto = userService.updateUserInfo(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("/updateUsername/{userId}")
    public ResponseEntity<?> updateUsernameByCustomer(
            @Valid @RequestBody UserDTO userDTO,
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDto = userService.updateUsernameByCustomer(userDTO, userId);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("/updateAvt/{userId}")
    public ResponseEntity<?> updateUserAvatar(
            @Valid @RequestBody UserDTO userDTO,
            @PathVariable("userId") Integer userId,
            Principal connectedUser
    ){
        UserDTO userDto = userService.updateUserAvatar(userDTO, userId);
        return new ResponseEntity<>(userDto.getAvatar(), HttpStatus.OK);
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
}
