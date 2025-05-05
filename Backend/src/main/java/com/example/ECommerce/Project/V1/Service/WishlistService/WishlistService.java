package com.example.ECommerce.Project.V1.Service.WishlistService;

import com.example.ECommerce.Project.V1.DTO.WishlistDTO;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Model.Wishlist;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Repository.WishlistRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService implements WishlistServiceInterface {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private WishlistDTO mapToDTO(Wishlist wishlist) {
        List<Integer> productIds = wishlist.getProducts() == null
                ? new ArrayList<>()
                : wishlist.getProducts().stream().map(Product::getId).collect(Collectors.toList());
        return new WishlistDTO(wishlist.getId(), wishlist.getUser().getId(), productIds);
    }
    @Override
    public WishlistDTO getWishlistByUserId(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User Not Found"));
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUser(user);
                    newWishlist.setProducts(new ArrayList<>());
                    return wishlistRepository.save(newWishlist);
                });
        return mapToDTO(wishlist);
    }

    @Override
    public WishlistDTO addProductToWishlist(Integer userId, Integer productId) {
        // Kiểm tra user và sản phẩm có tồn tại không
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        var product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Tìm wishlist của user, nếu không có thì khởi tạo mới
        Wishlist wishlist = wishlistRepository.findAll().stream()
                .filter(w -> w.getUser().getId().equals(userId))
                .findFirst()
                .orElseGet(() -> {
                    // Trường hợp wishlist chưa tồn tại, tạo mới và lưu vào db
                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUser(user);
                    newWishlist.setProducts(new ArrayList<>());
                    return wishlistRepository.save(newWishlist);
                });

        // Khởi tạo danh sách nếu null (trường hợp dữ liệu đã có nhưng chưa được khởi tạo danh sách)
        if (wishlist.getProducts() == null) {
            wishlist.setProducts(new ArrayList<>());
        }

        // Thêm sản phẩm nếu chưa tồn tại trong wishlist
        if (!wishlist.getProducts().contains(product)) {
            wishlist.getProducts().add(product);
            wishlist = wishlistRepository.save(wishlist);
        }
        return mapToDTO(wishlist);
    }

    @Override
    public WishlistDTO removeProductFromWishlist(Integer userId, Integer productId) {
        // Kiểm tra user và sản phẩm có tồn tại không
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        var product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Tìm wishlist của user
        Wishlist wishlist = wishlistRepository.findAll().stream()
                .filter(w -> w.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        if (wishlist.getProducts() != null && wishlist.getProducts().contains(product)) {
            wishlist.getProducts().remove(product);
            wishlist = wishlistRepository.save(wishlist);
        }
        return mapToDTO(wishlist);
    }
    @Override
    public Wishlist createWishlist(Integer userId) {
        // Kiểm tra user và products tồn tại
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProducts(new ArrayList<>());

        return wishlistRepository.save(wishlist);
    }

    // Các phương thức khác như update, delete có thể thêm vào đây
}