package com.example.ECommerce.Project.V1.Service.ProductService;

import com.example.ECommerce.Project.V1.Model.Product;

import java.util.List;
import java.util.UUID;

public interface IProductService {

    Product addProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(UUID id);
    Product updateProductById(UUID id, Product product);
    void deleteProductById(UUID id);
}
