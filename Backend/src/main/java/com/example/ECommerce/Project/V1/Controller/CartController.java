package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.CartDTO;
import com.example.ECommerce.Project.V1.DTO.CartItemDTO;
import com.example.ECommerce.Project.V1.Response.ResponseMessage;
import com.example.ECommerce.Project.V1.Service.CartService.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Integer userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addItemToCart(@PathVariable Integer userId,
                                                 @RequestBody CartItemDTO cartItemDTO) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, cartItemDTO));
    }

    @DeleteMapping("/{userId}/remove/{cartItemId}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable Integer userId,
                                                   @PathVariable Integer cartItemId) {
        cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Delete successfully."));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Clear successfully."));
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<CartDTO> updateCartItemQuantity(
            @RequestParam Integer userId,
            @RequestParam Integer cartItemId,
            @RequestParam int quantity) {

        CartDTO updatedCart = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
        return ResponseEntity.ok(updatedCart);
    }
}
