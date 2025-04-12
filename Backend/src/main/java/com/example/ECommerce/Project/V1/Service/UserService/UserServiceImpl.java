package com.example.ECommerce.Project.V1.Service.UserService;

import com.cloudinary.Cloudinary;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.ChangePasswordRequest;
import com.example.ECommerce.Project.V1.DTO.ChangeForgotPasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final Cloudinary cloudinary;

    @Value("http://localhost:8080")
    private String baseUrl;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        Integer userId;

        if (connectedUser instanceof JwtAuthenticationToken jwtToken) {
            Object userIdClaim = jwtToken.getToken().getClaims().get("userId");

            if (userIdClaim instanceof Number number) {
                userId = number.intValue();
            } else {
                throw new IllegalArgumentException("Invalid userId claim in JWT");
            }
        } else {
            throw new IllegalArgumentException("Unsupported principal type: " + connectedUser.getClass().getName());
        }

        User userFind = userRepository.findUserById(userId);

        if (request.getConfirmPassword().length() < 8 || request.getConfirmPassword().length() > 50) {
            throw new IllegalArgumentException("Password must be between 8 and 50 characters");
        }

        if(!passwordEncoder.matches(request.getCurrentPassword(), userFind.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadCredentialsException("Passwords and Confirm Passwords do not match");
        }

        userFind.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(userFind);
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
    public Integer findUserIdByUsername(UserDTO userDTO, String username) {
        User user = userRepository.findByEmail(username);
        return user.getId();
    }

    @Override
    public UserDTO updateUserAvatar(Integer userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found along with given ID!"));

        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            // 🔻 Delete the old image from Cloudinary if exists
            String oldImageUrl = user.getAvatar();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String publicId = extractPublicIdFromUrl(oldImageUrl);
                cloudinary.uploader().destroy(publicId, Map.of());
            }

            Map<String, Object> options = new HashMap<>();
            options.put("folder", "user_avt");
            options.put("tags", List.of("avatar"));

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            imageUrl = uploadResult.get("secure_url").toString();
        }

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
        userRepository.save(user);
        return mapper.map(user, UserDTO.class);
    }

    @Override
    public void changeForgotPassword(ChangeForgotPasswordRequest request, Principal connectedUser) {
        Integer userId;

        if (connectedUser instanceof JwtAuthenticationToken jwtToken) {
            Object userIdClaim = jwtToken.getToken().getClaims().get("userId");

            if (userIdClaim instanceof Number number) {
                userId = number.intValue();
            } else {
                throw new IllegalArgumentException("Invalid userId claim in JWT");
            }
        } else {
            throw new IllegalArgumentException("Unsupported principal type: " + connectedUser.getClass().getName());
        }

        User userFind = userRepository.findUserById(userId);

        if (request.getConfirmPassword().length() < 8 || request.getConfirmPassword().length() > 50) {
            throw new IllegalArgumentException("Password must be between 8 and 50 characters");
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadCredentialsException("Passwords and Confirm Passwords do not match");
        }

        userFind.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(userFind);
    }

    private String extractPublicIdFromUrl(String url) {
        try {
            String[] parts = url.split("/");
            int index = Arrays.asList(parts).indexOf("upload");
            if (index != -1 && index + 1 < parts.length) {
                // Join everything after 'upload' (skip version and extract public_id without extension)
                StringBuilder publicIdBuilder = new StringBuilder();
                for (int i = index + 2; i < parts.length; i++) {
                    String part = parts[i];
                    if (i == parts.length - 1) {
                        part = part.substring(0, part.lastIndexOf('.')); // remove .jpg/.png
                    }
                    publicIdBuilder.append(part);
                    if (i < parts.length - 1) publicIdBuilder.append("/");
                }
                return publicIdBuilder.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    @Override
    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToDTO(user);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .dob(user.getDob())
                .gender(user.getGender())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .isActive(user.isEnabled())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

}
