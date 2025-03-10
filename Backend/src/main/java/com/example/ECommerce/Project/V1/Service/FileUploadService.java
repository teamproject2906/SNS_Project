package com.example.ECommerce.Project.V1.Service;

import com.example.ECommerce.Project.V1.Config.TextFileHelper;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class FileUploadService {

    private final ProductRepository productRepository;
    private final TextFileHelper textFileHelper;

    public FileUploadService(ProductRepository productRepository, TextFileHelper textFileHelper) {
        this.productRepository = productRepository;
        this.textFileHelper = textFileHelper;
    }
    public void saveProductsFromTextFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new InvalidInputException("Please select a file");
        }

        String fileName = file.getOriginalFilename();
        String fileExtension = "";

        int dotIndex = 0;
        if (fileName != null) {
            dotIndex = fileName.lastIndexOf(".");
        }

        if(dotIndex >= 0) {
            fileExtension = fileName.substring(dotIndex + 1);
        }

        if(!fileExtension.equals("txt")) {
            throw new InvalidInputException("Invalid file format. Please upload a .txt file.");
        }

        try {
            List<Product> products = textFileHelper.textToProducts(file.getInputStream());
            productRepository.saveAll(products);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process the file: " + e.getMessage());
        }
    }
}
