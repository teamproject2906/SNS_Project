package com.example.ECommerce.Project.V1.Service.CartService;

import com.example.ECommerce.Project.V1.DTO.CartDTO;
import com.example.ECommerce.Project.V1.DTO.CartItemDTO;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Cart;
import com.example.ECommerce.Project.V1.Model.CartItem;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.CartItemRepository;
import com.example.ECommerce.Project.V1.Repository.CartRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService implements ICartService{
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;


//    @Override
//    public CartDTO getCart(int id) {
//        Cart cart = cartRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
//        return modelMapper.map(cart, CartDTO.class);
//    }
//
//    @Override
//    public double getTotalPrice(int id) {
//        CartDTO cartDTO = getCart(id);
//        return cartDTO.getTotalAmount();
//    }

    @Override
    public void initializeCartForUser(int userId) {
        Cart newCart = new Cart();
        User newUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        newCart.setUser(newUser);
        newCart.setTotalAmount(0.0);
        cartRepository.save(newCart);
    }

    @Override
    public CartDTO getCartByUserId(int userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return modelMapper.map(cart, CartDTO.class);
    }

    @Override
    public CartDTO clearCart(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Gỡ liên kết CartItem -> Cart trước khi xóa
        for (CartItem item : cart.getItems()) {
            item.setCart(null);  // Cập nhật liên kết, tránh orphan
            cartItemRepository.delete(item);  // Xóa CartItem
        }

        cart.getItems().clear();  // Xóa CartItem khỏi danh sách

        cart.setTotalAmount(0.0);
        cartRepository.save(cart);

        return new CartDTO(cart.getId(), userId, new ArrayList<>(), 0.0);
    }

    @Override
    public CartDTO addItemToCart(Integer userId, CartItemDTO cartItemDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setTotalAmount(0.0);
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Integer quantity = cartItemDTO.getQuantity();
        if (quantity <= 0) {
            throw new InvalidInputException("Quantity must be greater than 0");
        }
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingCartItem.isPresent()) {
            // Nếu sản phẩm đã có, tăng số lượng và cập nhật tổng giá
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemDTO.getQuantity());
            cartItem.setTotalPrice();
            cartItemRepository.save(cartItem);
        } else {
            // Nếu chưa có, thêm mục mới vào giỏ hàng
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(cartItemDTO.getQuantity());
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setTotalPrice();

            cart.addItem(cartItem);
            cartItemRepository.save(cartItem);
        }
        cart.updateTotalAmount();
        cartRepository.save(cart);
        return getCartByUserId(userId);
    }

    @Override
    public CartDTO removeItemFromCart(Integer userId, Integer cartItemId) {
        // 1. Tìm Cart của User
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // 2. Tìm CartItem cần xóa
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        // 3. Xóa CartItem khỏi Cart
        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        // 4. Cập nhật tổng tiền
        cart.updateTotalAmount();

        // 5. Lưu giỏ hàng vào DB
        cartRepository.save(cart);

        // 6. Chuyển Cart sang DTO để phản hồi API
        List<CartItemDTO> items = cart.getItems().stream()
                .map(item -> new CartItemDTO(
                        item.getId(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getProduct().getId(),
                                                item.getProduct().getProductName(),
                        cart.getId()))
                .collect(Collectors.toList());

        return new CartDTO(cart.getId(),userId, items, cart.getTotalAmount());
    }

    @Override
    public CartDTO updateCartItemQuantity(Integer userId, Integer cartItemId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

//        // Nếu số lượng mới < 1, giữ nguyên số lượng cũ
//        if (quantity < 1) {
//            quantity = cartItem.getQuantity();
//        }

        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice();
        cartItemRepository.save(cartItem);

        cart.updateTotalAmount();
        cartRepository.save(cart);

        return getCartByUserId(userId);
    }


}
