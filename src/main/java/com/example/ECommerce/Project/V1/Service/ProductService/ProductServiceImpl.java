package com.example.ECommerce.Project.V1.Service.ProductService;

import com.example.ECommerce.Project.V1.Model.FormClothes;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Repository.FormClothesRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductServiceImpl implements IProductService {
    private final ProductRepository repository;
    private final SizeChartRepository sizeChartRepository;
    private final FormClothesRepository formClothesRepository;

    public ProductServiceImpl(ProductRepository repository, SizeChartRepository sizeChartRepository, FormClothesRepository formClothesRepository) {
        this.repository = repository;
        this.sizeChartRepository = sizeChartRepository;
        this.formClothesRepository = formClothesRepository;
    }

    // Validate product code
    private void validateProductCode(String productCode) {
        if (productCode == null || productCode.isBlank()) {
            throw new IllegalArgumentException("Product code cannot be blank");
        } else if (repository.findProductByProductCode(productCode).isPresent()) {
            throw new IllegalArgumentException("Product code already exists");
        } else if(productCode.length() > 20) {
            throw new IllegalArgumentException("Product code cannot longer than 20 characters");
        }
    }

    // Validate product name
    private void validateProductName(String productName) {
        if(productName == null || productName.isBlank()) {
            throw new IllegalArgumentException("Product name cannot be blank");
        } else if (productName.length() > 100) {
            throw new IllegalArgumentException("Product name cannot longer than 100 characters");
        }
    }

    // Validate product price
    private void validateProductPrice(Double price) {
        if(price == null) {
            throw new IllegalArgumentException("Price cannot be null");
        } else if(price <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
    }

    private void validateProductColor(String productColor) {
        if(productColor == null || productColor.isBlank()) {
            throw new IllegalArgumentException("Product color cannot be blank");
        } else if (productColor.length() > 50) {
            throw new IllegalArgumentException("Product color cannot longer than 50 characters");
        }
    }

    private void validateMaterial(String material) {
        if(material == null || material.isBlank()) {
            throw new IllegalArgumentException("Material cannot be blank");
        } else if (material.length() > 100) {
            throw new IllegalArgumentException("Product color cannot longer than 100 characters");
        }
    }

    private void validateProductDescription(String productDescription) {
        if(productDescription == null || productDescription.isBlank()) {
            throw new IllegalArgumentException("Product description cannot be blank");
        }
    }

    private void validateProductInventory(Integer productInventory) {
        if(productInventory == null) {
            throw new IllegalArgumentException("Product inventory cannot be null");
        } else if(productInventory < 0) {
            throw new IllegalArgumentException("Product inventory must be greater than 0");
        }
    }

    private void validateSizeChart(SizeChart sizeChart) {
        // Validate sizeChart ID (ensure it is not null or empty)
        if(sizeChart == null || sizeChart.getId() == null ) {
            throw new IllegalArgumentException("Size chart ID cannot be null");
        }

        // Check if the provided SizeChart ID exists in the database
        Optional<SizeChart> validSizeChart = sizeChartRepository.findById(sizeChart.getId());
        if (validSizeChart.isEmpty()) {
            throw new IllegalArgumentException("Invalid SizeChart ID: SizeChart does not exist");
        }
    }

    private void validateFormClothes(FormClothes formClothes) {
        // Validate formClothes ID (ensure it is not null or empty)
        if(formClothes == null || formClothes.getId() == null ) {
            throw new IllegalArgumentException("Form clothes ID cannot be null");
        }

        Optional<FormClothes> validFormClothes = formClothesRepository.findById(formClothes.getId());
        if (validFormClothes.isEmpty()) {
            throw new IllegalArgumentException("Invalid FormClothes ID: FormClothes does not exist");
        }
    }

    private void validateAllFields(Product product) {
        // Trim the fields to remove extra spaces
        if(product.getProductCode() != null) {
            product.setProductCode(product.getProductCode().trim());
        }
        if(product.getProductName() != null) {
            product.setProductName(product.getProductName().trim());
        }
        if(product.getColor() != null) {
            product.setColor(product.getColor().trim());
        }
        if(product.getMaterial() != null) {
            product.setMaterial(product.getMaterial().trim());
        }
        if (product.getDescription() != null) {
            product.setDescription(product.getDescription().trim());
        }

        // Validate product code before saving
        validateProductCode(product.getProductCode());

        // Validate product name before saving
        validateProductName(product.getProductName());

        // Validate product price before saving
        validateProductPrice(product.getPrice());

        // Validate product color before saving
        validateProductColor(product.getColor());

        // Validate product material before saving
        validateMaterial(product.getMaterial());

        // Validate product description before saving
        validateProductDescription(product.getDescription());

        // Validate product inventory before saving
        validateProductInventory(product.getQuantityInventory());

        // Validate sizechart before saving
        validateSizeChart(product.getSizeChart());

        // Validate formClothes before saving
        validateFormClothes(product.getFormClothes());
    }

    @Override
    public Product addProduct(Product product) {

        validateAllFields(product);

        return repository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Override
    public Product getProductById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product with id: " + id + " not found!"));
    }

    @Override
    public Product updateProductById(UUID id, Product product) {
        return null;
    }

    @Override
    public void deleteProductById(UUID id) {

    }
}
