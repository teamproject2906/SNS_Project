package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.ProductResponseDTO;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Model.ProductGallery;
import com.example.ECommerce.Project.V1.Service.FileUploadService;
import com.example.ECommerce.Project.V1.Service.ProductGalleryService.IProductGalleryService;
import com.example.ECommerce.Project.V1.Service.ProductService.IProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final IProductService productService;
    private final FileUploadService fileUploadService;
    private final IProductGalleryService productGalleryService;

    public ProductController(IProductService productService, FileUploadService fileUploadService, IProductGalleryService productGalleryService) {
        this.productService = productService;
        this.fileUploadService = fileUploadService;
        this.productGalleryService = productGalleryService;
    }

    @PostMapping()
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.addProduct(product),HttpStatus.CREATED);
    }

    @PostMapping("/upload-file")
    public ResponseEntity<String> uploadProducts(@RequestParam("file")MultipartFile file) {
        try {

        fileUploadService.saveProductsFromTextFile(file);
        return ResponseEntity.ok("File uploaded successfully. New products were added.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("File upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<Product>> createMultipleProducts(@Valid @RequestBody List<Product> products) {
        return new ResponseEntity<>(productService.addMultipleProducts(products),HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Object> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();

        // Return a custom message when no product are available
        if (products.isEmpty()) return new ResponseEntity<>("There is no product. Please add new one.",HttpStatus.OK);

        return new ResponseEntity<>(productService.getAllProducts(),HttpStatus.OK);
    }

    // API tìm kiếm sản phẩm bằng hình ảnh
    @PostMapping("/search-by-image")
    public ResponseEntity<Object> searchProductsByImage(@RequestParam("file") MultipartFile file) {
        try {
            // Gửi hình ảnh tới app.py và lấy danh sách ProductCode
            List<String> productCodes = productService.searchProductCodesByImage(file);
            System.out.println("tesst: " + productCodes);

            // Nếu không tìm thấy ProductCode
            if (productCodes.isEmpty()) {
                return new ResponseEntity<>("No similar products found.", HttpStatus.OK);
            }

            // Tìm kiếm sản phẩm dựa trên list ProductCode
            List<ProductResponseDTO> products = productService.searchProductsByProductCodes(productCodes);

            // Nếu không có sản phẩm nào trong database
            if (products.isEmpty()) {
                return new ResponseEntity<>("No products found for the given product codes.", HttpStatus.OK);
            }

            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/productCode")
    public ResponseEntity<Object> getAllProductsUsingProductCode() {
        List<ProductResponseDTO> products = productService.getAllProductsUsingProductCode();

        // Return a custom message when no product are available
        if (products.isEmpty()) return new ResponseEntity<>("There is no product. Please add new one.",HttpStatus.OK);

        return new ResponseEntity<>(productService.getAllProductsUsingProductCode(),HttpStatus.OK);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Product>> getProductsPaginated(@RequestParam(defaultValue = "0") int page,   // Default to page 0
                                                              @RequestParam(defaultValue = "5") int size,    // Default to 5 items per page
                                                              @RequestParam(defaultValue = "id") String sortBy,
                                                              @RequestParam(defaultValue = "asc") String order
    ) {
        // Convert order to Spring's Sort.Direction safely
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

        List<String> validSortFileds = List.of("id", "price", "productName", "quantityInventory");
        if(!validSortFileds.contains(sortBy)) {
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(productService.getProducts(page,size, sortBy, direction));
    }
    
    @GetMapping("/getDetail/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductDetailById(@PathVariable Integer productId) {
        return new ResponseEntity<>(productService.getProductDTOById(productId),HttpStatus.OK);
    }

    @GetMapping("/productCode/{code}")
    public ResponseEntity<Object> getProductByProductCode(@PathVariable String code) {
        List<ProductResponseDTO> products = productService.getProductByProductCode(code);

        // Return a custom message when no product are available
        if (products.isEmpty()) return new ResponseEntity<>("There is no product with product code: " + code,HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(products,HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> getProductsByProductName(@RequestParam String name) {
        List<Product> products = productService.getProductByName(name);

        // Return a custom message when no product are available
        if (products.isEmpty()) return new ResponseEntity<>("There is no product with name: " + name,HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(products,HttpStatus.OK);
    }

    @GetMapping("/images/productCode/{productCode}")
    public ResponseEntity<?> getImagesOfProductCode(@PathVariable String productCode){
        List<ProductGallery> productGalleries = productGalleryService.getImageByProductCode(productCode);
        return new ResponseEntity<>(productGalleries, HttpStatus.OK);
    }

    @PatchMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer productId, @Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.updateProductById(productId, product),HttpStatus.OK);
    }

    @PatchMapping("/reactive/{productId}")
    public ResponseEntity<Product> updateProductReactive(@PathVariable Integer productId) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.reActivateProductById(productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer productId) {
        productService.deleteProductById(productId);

        return new ResponseEntity<>("Product deactive successfully",HttpStatus.OK);
    }

    @GetMapping("/export-image-csv")
    public ResponseEntity<String> exportProductImagesCSV() {
        try {
            productService.exportProductCodeAndImageToCSV();
            return ResponseEntity.ok("✅ Export thành công: file CSV đã được tạo tại thư mục dataset.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Lỗi khi export CSV: " + e.getMessage());
        }
    }
}
