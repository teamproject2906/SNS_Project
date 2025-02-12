package com.example.ECommerce.Project.V1.Service.FormClothesService;

import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.FormClothes;
import com.example.ECommerce.Project.V1.Repository.FormClothesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FormClothesServiceImpl implements IFormClothesService {

    private final FormClothesRepository repository;

    public FormClothesServiceImpl(FormClothesRepository repository) {
        this.repository = repository;
    }

    private String validateFormClothes(String formClothes) {
        if (formClothes == null || formClothes.isEmpty()) {
            throw new InvalidInputException("FormClothes cannot be empty");
        }

        formClothes = formClothes.trim();

        if (formClothes.length() == 0) {
            throw new InvalidInputException("FormClothes cannot be empty");
        }

        if (formClothes.length() > 100) {
            throw new InvalidInputException("FormClothes cannot exceed 100 characters");
        }

        if (!formClothes.matches("^[a-zA-Z\\\\s-]+$")) {
            throw new InvalidInputException("Form Clothes can only contain letters (a-z, A-Z), spaces, and hyphens (-).");
        }

        if(repository.existsFormClothesByFormClothes(formClothes)) {
            throw new InvalidInputException("Form Clothes '"+ formClothes +"' already exists");
        }

        return formClothes;
    }

    @Override
    public FormClothes createFormClothes(FormClothes formClothes) {
        String validatedFormClothes = validateFormClothes(formClothes.getFormClothes());
        formClothes.setFormClothes(validatedFormClothes);
        return repository.save(formClothes);
    }

    @Override
    public List<FormClothes> getAllFormClothes() {
        List<FormClothes> formClothesList = repository.findAll();
        return formClothesList;
    }

    @Override
    public FormClothes getFormClothesById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FormClothes with id: " + id + " not found"));
    }

    @Override
    public FormClothes updateFormClothes(UUID id, FormClothes formClothes) {
        FormClothes updatingFormClothes = getFormClothesById(id);

        if(updatingFormClothes != null) {
            String validatedFormClothes = validateFormClothes(formClothes.getFormClothes());
            updatingFormClothes.setFormClothes(validatedFormClothes);
            repository.save(updatingFormClothes);
        }

        return updatingFormClothes;
    }

    @Override
    public void deleteFormClothesById(UUID id) {
        FormClothes formClothes = getFormClothesById(id);

        if(formClothes != null) {
            repository.delete(formClothes);
        }
    }
}
