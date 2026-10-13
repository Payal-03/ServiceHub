package com.servicehub.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CreateRequestDto {

    private Long categoryId;
    private String serviceCategoryId;
    private String serviceCategory;

    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    private String serviceType; // Frontend uses serviceType as the problem/title

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "Locality is required")
    @Size(max = 100, message = "Locality must not exceed 100 characters")
    private String locality;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    private String addressDetails; // Frontend alias for address

    private BigDecimal expectedBudget;

    @DecimalMin(value = "1.0", message = "Budget must be greater than 0")
    private BigDecimal budget; // Frontend alias for expectedBudget

    public CreateRequestDto() {
    }

    public Long getResolvedCategoryId() {
        if (categoryId != null) return categoryId;
        if (serviceCategoryId != null) {
            try {
                return Long.parseLong(serviceCategoryId);
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    public String getResolvedTitle() {
        if (title != null && !title.trim().isEmpty()) return title.trim();
        if (serviceType != null && !serviceType.trim().isEmpty()) return serviceType.trim();
        return "Electrical Service Request";
    }

    public String getResolvedAddress() {
        if (address != null && !address.trim().isEmpty()) return address.trim();
        if (addressDetails != null && !addressDetails.trim().isEmpty()) return addressDetails.trim();
        return "";
    }

    public BigDecimal getResolvedBudget() {
        if (expectedBudget != null) return expectedBudget;
        if (budget != null) return budget;
        return BigDecimal.ZERO;
    }

    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getServiceCategoryId() {
        return serviceCategoryId;
    }

    public void setServiceCategoryId(String serviceCategoryId) {
        this.serviceCategoryId = serviceCategoryId;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressDetails() {
        return addressDetails;
    }

    public void setAddressDetails(String addressDetails) {
        this.addressDetails = addressDetails;
    }

    public BigDecimal getExpectedBudget() {
        return expectedBudget;
    }

    public void setExpectedBudget(BigDecimal expectedBudget) {
        this.expectedBudget = expectedBudget;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
}
