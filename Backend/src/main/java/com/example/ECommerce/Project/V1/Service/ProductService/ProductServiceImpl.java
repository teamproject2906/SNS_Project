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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
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
    @Autowired
    private RestTemplate restTemplate;

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
        } else if (productCode.length() > 20) {
            throw new InvalidInputException("Product code cannot longer than 20 characters");
        }
    }

    // Validate product name
    private void validateProductName(String productName) {
        if (productName == null || productName.isBlank()) {
            throw new InvalidInputException("Product name cannot be blank");
        } else if (productName.length() > 100) {
            throw new InvalidInputException("Product name cannot longer than 100 characters");
        }
    }

    // Validate product price
    private void validateProductPrice(Double price) {
        if (price == null) {
            throw new InvalidInputException("Price cannot be blank");
        } else if (price <= 0) {
            throw new InvalidInputException("Price must be greater than 0");
        }
    }

    // Validate color
    private void validateProductColor(String productColor) {
        if (productColor == null || productColor.isBlank()) {
            throw new InvalidInputException("Product color cannot be blank");
        } else if (productColor.length() > 50) {
            throw new InvalidInputException("Product color cannot longer than 50 characters");
        }
    }

    // Validate material
    private void validateMaterial(String material) {
        if (material == null || material.isBlank()) {
            throw new InvalidInputException("Material cannot be blank");
        } else if (material.length() > 50) {
            throw new InvalidInputException("Product material cannot longer than 50 characters");
        }
    }

    // Validate description
    private void validateProductDescription(String productDescription) {
        if (productDescription == null || productDescription.isBlank()) {
            throw new InvalidInputException("Product description cannot be blank");
        }
    }

    // Validate product inventory
    private void validateProductInventory(Integer productInventory) {
        if (productInventory == null) {
            throw new InvalidInputException("Product inventory cannot be blank");
        } else if (productInventory < 0) {
            throw new InvalidInputException("Product inventory must be greater than 0");
        }
    }

    private void validateSizeChart(SizeChart sizeChart, SizeChartRepository repository) {
        // Validate sizeChart ID (ensure it is not null or empty)
        if (sizeChart == null || sizeChart.getId() == null) {
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
        if (formClothes == null || formClothes.getId() == null) {
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
        if (category == null || category.getId() == null) {
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

    // Gửi hình ảnh tới app.py và lấy danh sách ProductCode
    @Override
    public List<String> searchProductCodesByImage(MultipartFile file) throws IOException {
        String appPyUrl = "http://localhost:5000/search";

        // Chuẩn bị dữ liệu gửi tới app.py
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        // Thiết lập header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Gửi yêu cầu tới app.py
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String[]> response = restTemplate.postForEntity(appPyUrl, requestEntity, String[].class);

        // Debug: In trạng thái và nội dung phản hồi
        System.out.println("Response Status: " + response.getStatusCode());
        System.out.println("Response Body: " + (response.getBody() != null ? String.join(", ", response.getBody()) : "null"));

        // Kiểm tra phản hồi từ app.py
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("Failed to get product codes from app.py. Status: " + response.getStatusCode() +
                    ", Body: " + (response.getBody() != null ? String.join(", ", response.getBody()) : "null"));
        }

        // Chuyển đổi mảng String từ response thành List<String>
        List<String> productCodes = new ArrayList<>();
        if (response.getBody() != null) {
            for (String code : response.getBody()) {
                if (code != null && !code.isEmpty()) {
                    productCodes.add(code);
                }
            }
        }

        // Debug clmm
        System.out.println("Extracted Product Codes: " + productCodes);
        return productCodes.isEmpty() ? new ArrayList<>() : productCodes;
    }

    // Tìm kiếm sản phẩm dựa trên list ProductCode
    @Override
    public List<ProductResponseDTO> searchProductsByProductCodes (List < String > productCodes) {
        List<ProductResponseDTO> listProductDTO = new ArrayList<>();
        for (String productCode : productCodes) {
            Product specificProduct = repository.findSpecificProductByProductCode(productCode)
                    .orElseThrow(() -> new IllegalArgumentException("Product with productCode " + productCode + " not found"));
            listProductDTO.add(convertProductEntityToDTO(specificProduct));
        }

        return listProductDTO;
    }

    @Override
    public List<ProductResponseDTO> getAllProductsUsingProductCode () {
        List<String> listProductCode = repository.getAllProductCodes();
        List<ProductResponseDTO> listProductDTO = new ArrayList<>();
        for (String productCode : listProductCode) {
            Product specificProduct = repository.findSpecificProductByProductCode(productCode)
                    .orElseThrow(() -> new IllegalArgumentException("Product with productCode " + productCode + " not found"));
            listProductDTO.add(convertProductEntityToDTO(specificProduct));
        }
        return listProductDTO;
    }

    @Override
    public void exportProductCodeAndImageToCSV () {
        List<String> productCodes = repository.getAllProductCodes();

        String outputPath = "D:/Major FPT/Semester 9 (Graduation Thesis)/Clothes Classification EfficientNetB0/Dataset/product_images.csv";

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            writer.write("ProductCode,ProductImage");
            writer.newLine();

            for (String code : productCodes) {
                Product product = repository.findSpecificProductByProductCode(code)
                        .orElseThrow(() -> new IllegalArgumentException("Product with code " + code + " not found"));

                String imageUrl = productGalleryService.getProductGalleryByIdAndMinSortOrder(product.getId());
                writer.write(code + "," + imageUrl);
                writer.newLine();
            }

            System.out.println("✅ CSV export successful: " + outputPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Page<Product> getProducts ( int page, int size, String sortBy, Sort.Direction sortDirection){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return productRepository.findAll(pageable);
    }


    @Override
    public Product getProductById (Integer id){
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id: " + id + " not found!"));
    }
    @Override
    public ProductResponseDTO getProductDTOById (Integer id){
        return convertProductEntityToDTO(getProductById(id));
    }


    @Override
    public List<ProductResponseDTO> getProductByProductCode (String productCode){
        List<Product> productListWithCode = repository.findProductByProductCode(productCode);
        return convertEntityListToDTOList(productListWithCode);
    }

    @Override
    public List<Product> getProductByName (String name){
        return repository.findProductsByProductNameContainingIgnoreCase(name);
    }

    @Override
    public Product updateProductById (Integer id, Product product){
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
    public void deleteProductById (Integer id){
        Product product = getProductById(id);

        if (product != null) {
            repository.deActivateProduct(id);
        }
    }

    @Override
    @Transactional
    public Product reActivateProductById (Integer id){
        Product product = getProductById(id);

        if (product != null) {
            // Activate the product
            product.setIsActive(true);
            repository.save(product);

            Category category = product.getCategory();

            // Activate the product's category
            if (!category.getIsActive()) {
                category.setIsActive(true);
                categoryRepository.save(category);
            }

            // Activate the parent category if it exists and inactive
            Category parent = category.getParentCategoryID();
            if (parent != null) {
                parent.setIsActive(true);
                categoryRepository.save(parent);
            }
        }

        return product;
    }

    @Override
    public void updateProductForOrder (Integer id, Integer orderQuantity){
        Product product = getProductById(id);

        if (product != null) {
            product.setQuantityInventory(product.getQuantityInventory() - orderQuantity);
            repository.save(product);
        }
    }
}
