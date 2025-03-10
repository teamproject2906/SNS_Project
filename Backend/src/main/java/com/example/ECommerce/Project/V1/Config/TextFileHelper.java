package com.example.ECommerce.Project.V1.Config;

import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Model.*;
import com.example.ECommerce.Project.V1.Repository.CategoryRepository;
import com.example.ECommerce.Project.V1.Repository.FormClothesRepository;
import com.example.ECommerce.Project.V1.Repository.PromotionRepository;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
public class TextFileHelper {

    private final CategoryRepository categoryRepository;
    private final SizeChartRepository sizeChartRepository;
    private final FormClothesRepository formClothesRepository;
    private final PromotionRepository promotionRepository;

    public TextFileHelper(CategoryRepository categoryRepository, SizeChartRepository sizeChartRepository, FormClothesRepository formClothesRepository, PromotionRepository promotionRepository) {
        this.categoryRepository = categoryRepository;
        this.sizeChartRepository = sizeChartRepository;
        this.formClothesRepository = formClothesRepository;
        this.promotionRepository = promotionRepository;
    }

    // Convert text file data to a list of Products
    public  List<Product> textToProducts(InputStream inputStream) {
        List<Product> products = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;

            while ((line = reader.readLine()) != null) {
                String[] values = line.split("\\|");

                if(values.length < 11) {
                    throw new InvalidInputException("Invalid data format in the file.");
                }

                Product product = new Product();
                product.setProductCode(values[0].trim());
                product.setProductName(values[1].trim());
                product.setPrice(Double.parseDouble(values[2].trim()));
                product.setColor(values[3].trim());
                product.setMaterial(values[4].trim());
                product.setDescription(values[5].trim());
                product.setQuantityInventory(Integer.parseInt(values[6].trim()));

                // Get Category
                Integer categoryId = Integer.parseInt(values[7].trim());
                Optional<Category> category = categoryRepository.findById(categoryId);
                if(category.isPresent()) {
                    product.setCategory(category.get());
                } else {
                    throw new InvalidInputException("Invalid categoryID: " + categoryId);
                }

                // Get SizeChart
                Integer sizeChartId = Integer.parseInt(values[8].trim());
                Optional<SizeChart> sizeChart = sizeChartRepository.findById(sizeChartId);
                if(sizeChart.isPresent()) {
                    product.setSizeChart(sizeChart.get());
                } else {
                    throw new InvalidInputException("Invalid sizeChartID: " + sizeChartId);
                }

                // Get FormClothes
                Integer formClothesId = Integer.parseInt(values[9].trim());
                Optional<FormClothes> formClothes = formClothesRepository.findById(formClothesId);
                if(formClothes.isPresent()) {
                    product.setFormClothes(formClothes.get());
                } else {
                    throw new InvalidInputException("Invalid formClothesID: " + formClothesId);
                }

                if(!values[10].trim().equalsIgnoreCase("NULL") && !values[10].trim().isEmpty()) {
                    product.setPromotion(promotionRepository.findById(Integer.parseInt(values[10].trim())).orElse(null));
                } else {
                    product.setPromotion(null);
                }

                products.add(product);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse text file: " + e.getMessage());
        }

        return products;
    }
}
