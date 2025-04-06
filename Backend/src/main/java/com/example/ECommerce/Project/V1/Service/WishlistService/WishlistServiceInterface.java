package com.example.ECommerce.Project.V1.Service.WishlistService;

import com.example.ECommerce.Project.V1.DTO.WishlistDTO;
import com.example.ECommerce.Project.V1.Model.Wishlist;

import java.util.List;

public interface WishlistServiceInterface {

    WishlistDTO getWishlistByUserId(Integer userId);

    WishlistDTO addProductToWishlist(Integer userId, Integer productId);

    WishlistDTO removeProductFromWishlist(Integer userId, Integer productId);

    Wishlist createWishlist(Integer userId);

    // Các phương thức khác nếu cần như update, delete
}
