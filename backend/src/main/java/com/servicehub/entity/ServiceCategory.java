package com.servicehub.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_categories")
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public ServiceCategory() {
    }

    public ServiceCategory(String categoryName, String description, Boolean isActive) {
        this.categoryName = categoryName;
        this.description = description;
        this.isActive = isActive != null ? isActive : true;
    }

    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
