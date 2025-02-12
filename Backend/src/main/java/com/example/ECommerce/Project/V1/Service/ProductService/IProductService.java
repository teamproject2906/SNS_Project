package com.example.ECommerce.Project.V1.Service.ProductService;

import com.example.ECommerce.Project.V1.Model.Product;

import java.util.List;
import java.util.UUID;

public interface IProductService {

    Product addProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(Integer id);
    Product getProductByProductCode(String productCode);
    List<Product> getProductByName(String name);
    Product updateProductById(Integer id, Product product);
    void deleteProductById(Integer id);
    Product reActivateProductById(Integer id);
}
