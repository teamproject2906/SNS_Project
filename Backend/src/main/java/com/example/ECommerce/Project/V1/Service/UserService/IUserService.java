package com.example.ECommerce.Project.V1.Service.UserService;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.ChangeForgotPasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

public interface IUserService {

    void changePassword(ChangePasswordRequest request, Principal connectedUser);

    UserDTO updateUserInfo(@Valid UserDTO userDTO, Integer userId);

    Integer findUserIdByUsername(@Valid UserDTO userDTO, String username);

    UserDTO updateUserAvatar(Integer userId, MultipartFile file) throws IOException;

    UserDTO changeEmail(@Valid UserDTO userDTO, Integer userId);

    UserDTO changePhoneNumber(@Valid UserDTO userDTO, Integer userId);

    UserDTO getUserProfile(Integer userId);

    List<UserDTO> getAllUsers();

    UserDTO banOrUbanUser(UserDTO userDTO, Integer userId);

    List<UserDTO> searchUserByUsername(String keyword);

    UserDTO setUserRole(@Valid UserDTO userDTO, Integer userId);

    void changeForgotPassword(ChangeForgotPasswordRequest request, Principal connectedUser);

//    UserDTO getUserById(Integer id);
}