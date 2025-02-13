package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Service.ProductService.IProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final IProductService productService;

    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @PostMapping()
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.addProduct(product),HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<Object> getAllProducts() {
        List<Product> products = productService.getAllProducts();

        // Return a custom message when no product are available
        if (products.isEmpty()) return new ResponseEntity<>("There is no product. Please add new one.",HttpStatus.OK);

        return new ResponseEntity<>(productService.getAllProducts(),HttpStatus.OK);
    }
    
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductDetailById(@PathVariable Integer productId) {
        return new ResponseEntity<>(productService.getProductById(productId),HttpStatus.OK);
    }

    @GetMapping("/productCode/{code}")
    public ResponseEntity<Product> getProductByProductCode(@PathVariable String code) {
        return new ResponseEntity<>(productService.getProductByProductCode(code),HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getProductsByProductName(@PathVariable String name) {
        List<Product> products = productService.getProductByName(name);

        // Return a custom message when no product are available
        if (products.isEmpty()) return new ResponseEntity<>("There is no product with name: " + name,HttpStatus.OK);

        return new ResponseEntity<>(products,HttpStatus.OK);
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
}
