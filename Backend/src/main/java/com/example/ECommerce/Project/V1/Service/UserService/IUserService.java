package com.example.ECommerce.Project.V1.Service.UserService;

import com.example.ECommerce.Project.V1.DTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.PageableResponse;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

public interface IUserService {
    void changePassword(ChangePasswordRequest request, Principal connectedUser);

    UserDTO updateUserInfo(@Valid UserDTO userDTO, Integer userId);

    UserDTO updateUsernameByCustomer(@Valid UserDTO userDTO, Integer userId);

    UserDTO updateUserAvatar(Integer userId, MultipartFile file) throws IOException;

    UserDTO changeEmail(@Valid UserDTO userDTO, Integer userId);

    UserDTO changePhoneNumber(@Valid UserDTO userDTO, Integer userId);

    UserDTO getUserProfile(Integer userId);

    List<UserDTO> getAllUsers();

    UserDTO banOrUbanUser(UserDTO userDTO, Integer userId);

    List<UserDTO> searchUserByUsername(String keyword);

    UserDTO setUserRole(@Valid UserDTO userDTO, Integer userId);
}
