package com.example.ECommerce.Project.V1.Service.PromotionService;

import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Promotion;
import com.example.ECommerce.Project.V1.Repository.PromotionRepository;
import com.example.ECommerce.Project.V1.Service.PromotionService.IPromotionService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionServiceImpl implements IPromotionService {
    private final PromotionRepository repository;
    private final EntityManager entityManager;

    public PromotionServiceImpl(PromotionRepository repository, EntityManager entityManager) {
        this.repository = repository;
        this.entityManager = entityManager;
    }

    private void validatePromotionName(String name) {
        if(name == null || name.isBlank()) {
            throw new InvalidInputException("Promotion name cannot be null or empty");
        }
        if (name.length() > 100) {
            throw new InvalidInputException("Promotion name cannot exceed 100 characters");
        } else if (!name.matches("^[a-zA-Z0-9 ']+$")) {
            throw new InvalidInputException("Promotion name cannot contain special characters");
        }
    }

    private void validatepromotionDiscount(Double discount) {
        if (discount == null) {
            throw new InvalidInputException("Discount cannot be null");
        }

        if (discount < 0 || discount > 1) {
            throw new InvalidInputException("Discount must be between 0 and 1");
        }
    }

    private void validateDescription(String description) {
        if (description != null) {
            if (description.length() > 100) {
                throw new InvalidInputException("Description cannot exceed 100 characters");
            } else if(!description.matches("^[a-zA-Z0-9 '!]+$")) {
                throw new InvalidInputException("Description cannot contain special characters");
            }
        }
    }

    private void validateDates(LocalDateTime startDate, LocalDateTime enddate) {
        if(startDate == null || enddate == null) {
            throw new InvalidInputException("StartDate and EndDate cannot be null");
        }

        if(!enddate.isAfter(startDate)) {
            throw new InvalidInputException("EndDate must be after StartDate");
        }

        if(startDate.isBefore(LocalDateTime.now())) {
            throw new InvalidInputException("StartDate must be in the future");
        }
    }

    private void validatePromotion(Promotion promotion) {
        validatePromotionName(promotion.getName().trim());
        validatepromotionDiscount(promotion.getDiscount());
        validateDescription(promotion.getDescription());
        validateDates(promotion.getStartDate(), promotion.getEndDate());
    }

    @Override
    public Promotion addPromotion(Promotion promotion) {
        validatePromotion(promotion);

        Promotion newPromotion = Promotion.builder()
               .name(promotion.getName().trim())
               .discount(promotion.getDiscount())
               .description(promotion.getDescription() != null ? promotion.getDescription().trim() : null)
               .startDate(promotion.getStartDate())
               .endDate(promotion.getEndDate())
               .build();

        return repository.save(newPromotion);
    }

    @Override
    public List<Promotion> getAllPromotions() {
        return repository.findAll();
    }

    @Override
    public Promotion getPromotionById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
    }

    @Override
    public Promotion updatePromotionById(Integer id, Promotion promotion) {
        Promotion updatingPromotion = getPromotionById(id);

        if(updatingPromotion != null) {
            // Update 'name' if provided
            if(promotion.getName() != null) {
                validatePromotionName(promotion.getName().trim());
                updatingPromotion.setName(promotion.getName().trim());
            }

            // Update 'discount' if provided
            if(promotion.getDiscount() != null) {
                validatepromotionDiscount(promotion.getDiscount());
                updatingPromotion.setDiscount(promotion.getDiscount());
            }

            // Update 'description' if provided
            if(promotion.getDescription() != null) {
                validateDescription(promotion.getDescription());
                updatingPromotion.setDescription(promotion.getDescription());
            }

            // Update 'startDate' and 'endDate' if both are provided
            if(promotion.getStartDate() != null && promotion.getEndDate() != null) {
                validateDates(promotion.getStartDate(), promotion.getEndDate());
                updatingPromotion.setStartDate(promotion.getStartDate());
                updatingPromotion.setEndDate(promotion.getEndDate());
            } else if(promotion.getStartDate() != null || promotion.getEndDate() != null) {
                throw new InvalidInputException("Promotion startDate and endDate must be provided to update");
            }

            repository.save(updatingPromotion);
        }
        return updatingPromotion;
    }

    @Override
    public void deletePromotionById(Integer id) {
        Promotion promotion = getPromotionById(id);

        if(promotion != null) {
            repository.deActivatePromotion(id);
        }
    }

    @Override
    @Transactional
    public Promotion reActivatePromotionById(Integer id) {
        Promotion promotion = getPromotionById(id);

        if (promotion != null) {
            repository.reActivatePromotion(id);
            entityManager.refresh(promotion);
        }

        return promotion;
    }
}
