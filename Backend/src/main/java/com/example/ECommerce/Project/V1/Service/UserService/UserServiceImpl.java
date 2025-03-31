package com.example.ECommerce.Project.V1.Service.UserService;

import com.cloudinary.Cloudinary;
import com.example.ECommerce.Project.V1.DTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.PageableResponse;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Helper.Helper;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import com.example.ECommerce.Project.V1.Service.UserService.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final Cloudinary cloudinary;

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
        user.setUpdatedBy(user.getUsername());
        user.setUpdatedAt(LocalDateTime.now());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO updateUserAvatar(Integer userId, MultipartFile fileAvt) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));

        Map<String, Object> options = new HashMap<>();
        options.put("folder", "user_avt");
        options.put("tags", List.of("avatar"));

        Map uploadResult = cloudinary.uploader().upload(fileAvt.getBytes(), options);

        String imageUrl = uploadResult.get("secure_url").toString();

        user.setAvatar(imageUrl);
        user.setUpdatedBy(user.getUsername());
        user.setUpdatedAt(LocalDateTime.now());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO changeEmail(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setEmail(userDTO.getEmail());
        user.setUpdatedBy(user.getUsername());
        user.setUpdatedAt(LocalDateTime.now());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO changePhoneNumber(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setUpdatedBy(user.getUsername());
        user.setUpdatedAt(LocalDateTime.now());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public UserDTO getUserProfile(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        return mapper.map(user, UserDTO.class);
    }

    @Override
    public List<UserDTO> getAllUsers() {
//        Sort sort = (sortDir.equalsIgnoreCase("desc")) ? (Sort.by(sortBy).descending()) : (Sort.by(sortBy).ascending());
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
//        Page<User> page = userRepository.findAll(pageable);
//        return Helper.getPageableResponse(page, UserDTO.class);

        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> mapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO banOrUbanUser(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        user.setIsActive(userDTO.isActive());
        user.setUpdatedBy("ADMIN");
        user.setUpdatedAt(LocalDateTime.now());
        User userSaved = userRepository.save(user);
        return mapper.map(userSaved, UserDTO.class);
    }

    @Override
    public List<UserDTO> searchUserByUsername(String keyword) {
//        Sort sort = (sortDir.equalsIgnoreCase("desc")) ? (Sort.by(sortBy).descending()) : (Sort.by(sortBy).ascending());
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
//        Page<User> page = userRepository.findByUsernameContaining(keyword, pageable);
//        return Helper.getPageableResponse(page, UserDTO.class);
        List<User> users = userRepository.findByUsernameContaining(keyword);
        return users.stream()
                .map(user -> mapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO setUserRole(UserDTO userDTO, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));
        if(userDTO.getRole().equals("CUSTOMER")) {user.setRole(Role.USER);}
        if(userDTO.getRole().equals("STAFF")) {user.setRole(Role.STAFF);}
        if(userDTO.getRole().equals("MODERATOR")) {user.setRole(Role.MODERATOR);}
        return mapper.map(user, UserDTO.class);
    }
}
