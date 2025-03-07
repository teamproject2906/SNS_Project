package com.example.ECommerce.Project.V1.Service.UserService;

import com.example.ECommerce.Project.V1.DTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import jakarta.validation.Valid;

import java.security.Principal;

public interface IUserService {
    void changePassword(ChangePasswordRequest request, Principal connectedUser);

    UserDTO updateUserInfo(@Valid UserDTO userDTO, Integer userId);

    UserDTO updateUsernameByCustomer(@Valid UserDTO userDTO, Integer userId);

    UserDTO updateUserAvatar(@Valid UserDTO userDTO, Integer userId);

    UserDTO changeEmail(@Valid UserDTO userDTO, Integer userId);

    UserDTO changePhoneNumber(@Valid UserDTO userDTO, Integer userId);
}
