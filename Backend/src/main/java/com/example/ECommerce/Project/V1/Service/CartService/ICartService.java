package com.example.ECommerce.Project.V1.Service.CartService;

import com.example.ECommerce.Project.V1.DTO.CartDTO;
import com.example.ECommerce.Project.V1.DTO.CartItemDTO;
import com.example.ECommerce.Project.V1.Model.Cart;


public interface ICartService {

    CartDTO clearCart(Integer userId);

    void initializeCartForUser(int userId);

    CartDTO getCartByUserId(int userId);

    CartDTO addItemToCart(Integer userId, CartItemDTO cartItemDTO);

    CartDTO removeItemFromCart(Integer userId, Integer cartItemId);

    CartDTO updateCartItemQuantity(Integer userId, Integer cartItemId, int quantity);
}
