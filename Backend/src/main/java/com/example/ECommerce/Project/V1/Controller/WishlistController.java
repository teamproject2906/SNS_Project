package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.WishlistDTO;
import com.example.ECommerce.Project.V1.Model.Wishlist;

import com.example.ECommerce.Project.V1.Service.WishlistService.WishlistServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistServiceInterface wishlistService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<WishlistDTO> getWishlistByUserId(@PathVariable Integer userId) {
        try {
            WishlistDTO wishlistDTO = wishlistService.getWishlistByUserId(userId);
            return new ResponseEntity<>(wishlistDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/user/{userId}/add/{productId}")
    public ResponseEntity<WishlistDTO> addProductToWishlist(@PathVariable Integer userId, @PathVariable Integer productId) {
        try {
            WishlistDTO wishlistDTO = wishlistService.addProductToWishlist(userId, productId);
            return new ResponseEntity<>(wishlistDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/user/{userId}/remove/{productId}")
    public ResponseEntity<WishlistDTO> removeProductFromWishlist(@PathVariable Integer userId, @PathVariable Integer productId) {
        try {
            WishlistDTO wishlistDTO = wishlistService.removeProductFromWishlist(userId, productId);
            return new ResponseEntity<>(wishlistDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Các phương thức khác như update, delete có thể thêm vào đây
}

