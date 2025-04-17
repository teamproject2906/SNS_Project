package com.example.ECommerce.Project.V1.Service.ProductService;

import com.example.ECommerce.Project.V1.DTO.*;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.*;
import com.example.ECommerce.Project.V1.Repository.CategoryRepository;
import com.example.ECommerce.Project.V1.Repository.FormClothesRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import com.example.ECommerce.Project.V1.Service.ProductGalleryService.IProductGalleryService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements IProductService {
    private final ProductRepository repository;
    private final SizeChartRepository sizeChartRepository;
    private final FormClothesRepository formClothesRepository;
    private final CategoryRepository categoryRepository;
    private final EntityManager entityManager;
    private final ProductRepository productRepository;
    @Autowired
    private IProductGalleryService productGalleryService;

    public ProductServiceImpl(ProductRepository repository, SizeChartRepository sizeChartRepository, FormClothesRepository formClothesRepository, CategoryRepository categoryRepository, EntityManager entityManager, ProductRepository productRepository, IProductGalleryService productGalleryService) {
        this.repository = repository;
        this.sizeChartRepository = sizeChartRepository;
        this.formClothesRepository = formClothesRepository;
        this.categoryRepository = categoryRepository;
        this.entityManager = entityManager;
        this.productRepository = productRepository;
    }

    // Validate product code
    private void validateProductCode(String productCode, ProductRepository repository) {
        if (productCode == null || productCode.isBlank()) {
            throw new InvalidInputException("Product code cannot be blank");
        } else if(productCode.length() > 20) {
            throw new InvalidInputException("Product code cannot longer than 20 characters");
        }
    }

    // Validate product name
    private void validateProductName(String productName) {
        if(productName == null || productName.isBlank()) {
            throw new InvalidInputException("Product name cannot be blank");
        } else if (productName.length() > 100) {
            throw new InvalidInputException("Product name cannot longer than 100 characters");
        }
    }

    // Validate product price
    private void validateProductPrice(Double price) {
        if(price == null) {
            throw new InvalidInputException("Price cannot be blank");
        } else if(price <= 0) {
            throw new InvalidInputException("Price must be greater than 0");
        }
    }

    // Validate color
    private void validateProductColor(String productColor) {
        if(productColor == null || productColor.isBlank()) {
            throw new InvalidInputException("Product color cannot be blank");
        } else if (productColor.length() > 50) {
            throw new InvalidInputException("Product color cannot longer than 50 characters");
        }
    }

    // Validate material
    private void validateMaterial(String material) {
        if(material == null || material.isBlank()) {
            throw new InvalidInputException("Material cannot be blank");
        } else if (material.length() > 50) {
            throw new InvalidInputException("Product material cannot longer than 50 characters");
        }
    }

    // Validate description
    private void validateProductDescription(String productDescription) {
        if(productDescription == null || productDescription.isBlank()) {
            throw new InvalidInputException("Product description cannot be blank");
        }
    }

    // Validate product inventory
    private void validateProductInventory(Integer productInventory) {
        if(productInventory == null) {
            throw new InvalidInputException("Product inventory cannot be blank");
        } else if(productInventory < 0) {
            throw new InvalidInputException("Product inventory must be greater than 0");
        }
    }

    private void validateSizeChart(SizeChart sizeChart, SizeChartRepository repository) {
        // Validate sizeChart ID (ensure it is not null or empty)
        if(sizeChart == null || sizeChart.getId() == null ) {
            throw new InvalidInputException("Size chart ID cannot be null");
        }

        // Check if the provided SizeChart ID exists in the database
        Optional<SizeChart> validSizeChart = repository.findById(sizeChart.getId());
        if (validSizeChart.isEmpty()) {
            throw new InvalidInputException("Invalid SizeChart ID: SizeChart does not exist");
        }
    }

    private void validateFormClothes(FormClothes formClothes, FormClothesRepository repository) {
        // Validate formClothes ID (ensure it is not null or empty)
        if(formClothes == null || formClothes.getId() == null ) {
            throw new InvalidInputException("Form clothes ID cannot be null");
        }

        // Check if the provided FormClothes ID exists in the database
        Optional<FormClothes> validFormClothes = repository.findById(formClothes.getId());
        if (validFormClothes.isEmpty()) {
            throw new InvalidInputException("Invalid FormClothes ID: FormClothes does not exist");
        }
    }

    private void validateCategory(Category category, CategoryRepository repository) {
        // Validate formClothes ID (ensure it is not null or empty)
        if(category == null || category.getId() == null ) {
            throw new InvalidInputException("Category ID cannot be null");
        }

        // Check if the provided Category ID exists in the database
        Optional<Category> validCategory = repository.findById(category.getId());
        if (validCategory.isEmpty()) {
            throw new InvalidInputException("Invalid Category ID: Category does not exist");
        }
    }

    private void trimProductFields(Product product) {
        // Trim the fields to remove extra spaces
        if (product.getProductCode() != null) product.setProductCode(product.getProductCode().trim());
        if (product.getProductName() != null) product.setProductName(product.getProductName().trim());
        if (product.getColor() != null) product.setColor(product.getColor().trim());
        if (product.getMaterial() != null) product.setMaterial(product.getMaterial().trim());
        if (product.getDescription() != null) product.setDescription(product.getDescription().trim());
    }

    private void validateProduct(Product product) {
        // Trim fields
        trimProductFields(product);

        // Validate product code before saving
        validateProductCode(product.getProductCode(), repository);

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
        validateSizeChart(product.getSizeChart(), sizeChartRepository);

        // Validate formClothes before saving
        validateFormClothes(product.getFormClothes(), formClothesRepository);

        // Validate category before saving
        validateCategory(product.getCategory(), categoryRepository);
    }

    private CategoryResponseDTO convertCategoryEntityToCategoryResponseDTO(Category category) {
        ParentCategoryResponseDTO parentCategoryDTO = null;
        if (category.getParentCategoryID() != null) {
            parentCategoryDTO = new ParentCategoryResponseDTO(
                    category.getParentCategoryID().getId(),
                    category.getParentCategoryID().getIsActive(),
                    category.getParentCategoryID().getCategoryName()
            );
        }

        return new CategoryResponseDTO(
                category.getId(),
                category.getCategoryName(),
                category.getIsActive(),
                parentCategoryDTO
        );
    }

    private SizeChartResponseDTO convertSizeChartEntityToDTO(SizeChart entity) {
        SizeChartResponseDTO dto = new SizeChartResponseDTO();

        dto.setId(entity.getId());
        dto.setSizeChartType(entity.getSizeChartType());
        dto.setValue(entity.getValue());
        dto.setActive(entity.getIsActive());

        return dto;
    }

    private FormClothesResponseDTO convertFormClothesEntityToDTO(FormClothes entity) {
        FormClothesResponseDTO dto = new FormClothesResponseDTO();
        dto.setId(entity.getId());
        dto.setFormClothes(entity.getFormClothes());

        return dto;
    }

    private PromotionResponseDTO convertEntityPromotionToResponseDTO(Promotion promotion) {
        PromotionResponseDTO promotionResponseDTO = new PromotionResponseDTO();

        promotionResponseDTO.setId(promotion.getId());
        promotionResponseDTO.setName(promotion.getName());
        promotionResponseDTO.setDiscount(promotion.getDiscount());
        promotionResponseDTO.setDescription(promotion.getDescription());
        promotionResponseDTO.setStartDate(promotion.getStartDate());
        promotionResponseDTO.setEndDate(promotion.getEndDate());

        return promotionResponseDTO;
    }


    private ProductResponseDTO convertProductEntityToDTO(Product product) {
        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setId(product.getId());
        productResponseDTO.setProductCode(product.getProductCode());
        productResponseDTO.setProductName(product.getProductName());
        productResponseDTO.setPrice(product.getPrice());
        productResponseDTO.setColor(product.getColor());
        productResponseDTO.setMaterial(product.getMaterial());
        productResponseDTO.setDescription(product.getDescription());
        productResponseDTO.setQuantityInventory(product.getQuantityInventory());
        productResponseDTO.setCategory(convertCategoryEntityToCategoryResponseDTO(product.getCategory()));
        productResponseDTO.setSizeChart(convertSizeChartEntityToDTO(product.getSizeChart()));
        productResponseDTO.setFormClothes(convertFormClothesEntityToDTO(product.getFormClothes()));
        productResponseDTO.setPromotion(product.getPromotion() != null ? convertEntityPromotionToResponseDTO(product.getPromotion()) : null);
        productResponseDTO.setImageUrl(productGalleryService.getProductGalleryByIdAndMinSortOrder(product.getId()));
        productResponseDTO.setCreatedAt(product.getCreatedAt());
        productResponseDTO.setActive(product.getIsActive());
        return productResponseDTO;
    }



    private List<ProductResponseDTO> convertEntityListToDTOList(List<Product> products) {
        return products.stream().map(this::convertProductEntityToDTO).collect(Collectors.toList());
    }


    @Override
    public Product addProduct(Product newProduct) {
        validateProduct(newProduct);

        return repository.save(newProduct);
    }

    @Override
    public List<Product> addMultipleProducts(List<Product> products) {
        for (Product product : products) {
            validateProduct(product);
        }

        return repository.saveAll(products);
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {
        return convertEntityListToDTOList(productRepository.findAll());
    }

    @Override
    public List<ProductResponseDTO> getAllProductsUsingProductCode(){
        List<String> listProductCode = repository.getAllProductCodes();
        List<ProductResponseDTO> listProductDTO = new ArrayList<>();
        for(String productCode : listProductCode){
            Product specificProduct = repository.findSpecificProductByProductCode(productCode)
                    .orElseThrow(() -> new IllegalArgumentException("Product with productCode " + productCode + " not found"));
            listProductDTO.add(convertProductEntityToDTO(specificProduct));
        }
        return  listProductDTO;
    }

    @Override
    public Page<Product> getProducts(int page, int size, String sortBy, Sort.Direction sortDirection) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return productRepository.findAll(pageable);
    }


    @Override
    public Product getProductById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id: " + id + " not found!"));
    }
    @Override
    public ProductResponseDTO getProductDTOById(Integer id){
        return convertProductEntityToDTO(getProductById(id));
    }


    @Override
    public List<ProductResponseDTO> getProductByProductCode(String productCode) {
        List<Product> productListWithCode = repository.findProductByProductCode(productCode);
        return convertEntityListToDTOList(productListWithCode);
    }

    @Override
    public List<Product> getProductByName(String name) {
        return repository.findProductsByProductNameContainingIgnoreCase(name);
    }

    @Override
    public Product updateProductById(Integer id, Product product) {
        Product updatingProduct = getProductById(id);

        if (updatingProduct != null) {
            // Trim fields in the incoming product object
            trimProductFields(product);

            // Update fields (only update non-null fields)
            if (product.getProductCode() != null) {
                validateProductCode(product.getProductCode(), repository);
                updatingProduct.setProductCode(product.getProductCode());
            }

            if (product.getProductName() != null) {
                validateProductName(product.getProductName());
                updatingProduct.setProductName(product.getProductName());
            }

            if (product.getPrice() != null) {
                validateProductPrice(product.getPrice());
                updatingProduct.setPrice(product.getPrice());
            }
            if (product.getColor() != null) {
                validateProductColor(product.getColor());
                updatingProduct.setColor(product.getColor());
            }
            if (product.getMaterial() != null) {
                validateMaterial(product.getMaterial());
                updatingProduct.setMaterial(product.getMaterial());
            }
            if (product.getDescription() != null) {
                validateProductDescription(product.getDescription());
                updatingProduct.setDescription(product.getDescription());
            }
            if (product.getQuantityInventory() != null) {
                validateProductInventory(product.getQuantityInventory());
                updatingProduct.setQuantityInventory(product.getQuantityInventory());
            }
            if (product.getCategory() != null) {
                validateCategory(product.getCategory(), categoryRepository);
                updatingProduct.setCategory(product.getCategory());
            }
            if (product.getSizeChart() != null) {
                validateSizeChart(product.getSizeChart(), sizeChartRepository);
                updatingProduct.setSizeChart(product.getSizeChart());
            }
            if (product.getFormClothes() != null) {
                validateFormClothes(product.getFormClothes(), formClothesRepository);
                updatingProduct.setFormClothes(product.getFormClothes());
            }
            if (product.getPromotion() != null) {
                updatingProduct.setPromotion(product.getPromotion());
            }

            // Save the updated object
             repository.save(updatingProduct);
        }

        return updatingProduct;
    }

    @Override
    public void deleteProductById(Integer id) {
        Product product = getProductById(id);

        if (product != null) {
            repository.deActivateProduct(id);
        }
    }

    @Override
    @Transactional
    public Product reActivateProductById(Integer id) {
        Product product = getProductById(id);

        if (product != null) {
            repository.reActivateProduct(id);
            entityManager.refresh(product);
        }

        return product;
    }
    @Override
    public void updateProductForOrder (Integer id, Integer orderQuantity){
        Product product =  getProductById(id);

        if(product != null){
            product.setQuantityInventory(product.getQuantityInventory()- orderQuantity);
            repository.save(product);
        }
    }
}
