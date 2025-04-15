package com.example.ECommerce.Project.V1.Service.ProductService;

import com.example.ECommerce.Project.V1.DTO.ProductResponseDTO;
import com.example.ECommerce.Project.V1.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

public interface IProductService {

    Product addProduct(Product product);
    List<Product> addMultipleProducts(List<Product> products);
    List<ProductResponseDTO> getAllProducts();

    List<ProductResponseDTO> getAllProductsUsingProductCode();

    Page<Product> getProducts(int page, int size, String sortBy, Sort.Direction sortDirection);
    Product getProductById(Integer id);

    ProductResponseDTO getProductDTOById(Integer id);

    List<ProductResponseDTO> getProductByProductCode(String productCode);
    List<Product> getProductByName(String name);
    Product updateProductById(Integer id, Product product);
    void deleteProductById(Integer id);
    Product reActivateProductById(Integer id);
    void  updateProductForOrder (Integer id, Integer orderQuantity );
}
