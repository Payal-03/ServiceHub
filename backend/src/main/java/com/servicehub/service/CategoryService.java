package com.servicehub.service;

import com.servicehub.dto.CategoryDto;
import com.servicehub.entity.ServiceCategory;
import com.servicehub.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public CategoryService(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(cat -> new CategoryDto(
                        cat.getCategoryId(),
                        cat.getCategoryName(),
                        cat.getDescription(),
                        cat.getIsActive()
                ))
                .collect(Collectors.toList());
    }

    public ServiceCategory getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }
}
