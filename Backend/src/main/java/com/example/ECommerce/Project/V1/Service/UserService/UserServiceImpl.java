package com.example.ECommerce.Project.V1.Service.UserService;

import com.example.ECommerce.Project.V1.DTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.Service.UserService.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadCredentialsException("Passwords and Confirm Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDTO updateUserInfo(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setFirstname(userDTO.getFirstname());
        user.setLastname(userDTO.getLastname());
        user.setDob(userDTO.getDob());
        user.setGender(userDTO.getGender());
        user.setBio(userDTO.getBio());
        user.setUpdatedBy(user.getUsername());
        user.setUpdatedAt(LocalDateTime.now());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO updateUsernameByCustomer(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setUsername(userDTO.getUsername());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO updateUserAvatar(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setAvatar(userDTO.getAvatar());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO changeEmail(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setEmail(userDTO.getEmail());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO changePhoneNumber(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setPhoneNumber(userDTO.getPhoneNumber());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }
}
