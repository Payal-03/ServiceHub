package com.servicehub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ServiceRequestDto {

    private String id;
    private String requestNumber;
    private String customerId;
    private String customerUserId;  // The User.userId of the customer (for frontend ownership check)
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerAvatar;

    private String serviceCategoryId;
    private String serviceCategory;
    private String title;
    private String description;

    private String city;
    private String locality;
    private String pincode;
    private String address;

    private BigDecimal expectedBudget;
    private String status;

    private String selectedElectricianId;
    private ElectricianSummaryDto selectedElectrician;

    private Boolean customerConfirmed;
    private Boolean electricianConfirmed;

    private int interestedCount;
    private List<InterestDto> interestedProviders = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class ElectricianSummaryDto {
        private String id;
        private String name;
        private String phone;
        private String email;
        private Double rating;
        private Integer experienceYears;

        public ElectricianSummaryDto() {
        }

        public ElectricianSummaryDto(String id, String name, String phone, String email, Double rating, Integer experienceYears) {
            this.id = id;
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.rating = rating != null ? rating : 0.0;
            this.experienceYears = experienceYears;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Double getRating() {
            return rating;
        }

        public void setRating(Double rating) {
            this.rating = rating;
        }

        public Integer getExperienceYears() {
            return experienceYears;
        }

        public void setExperienceYears(Integer experienceYears) {
            this.experienceYears = experienceYears;
        }
    }

    public ServiceRequestDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber) {
        this.requestNumber = requestNumber;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
    public String getCustomerUserId() {
        return customerUserId;
    }

    public void setCustomerUserId(String customerUserId) {
        this.customerUserId = customerUserId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerAvatar() {
        return customerAvatar;
    }

    public void setCustomerAvatar(String customerAvatar) {
        this.customerAvatar = customerAvatar;
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

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getExpectedBudget() {
        return expectedBudget;
    }

    public void setExpectedBudget(BigDecimal expectedBudget) {
        this.expectedBudget = expectedBudget;
    }

    // Retain getBudget/setBudget as direct delegators to expectedBudget for JSON compatibility
    public BigDecimal getBudget() {
        return expectedBudget;
    }

    public void setBudget(BigDecimal budget) {
        this.expectedBudget = budget;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSelectedElectricianId() {
        return selectedElectricianId;
    }

    public void setSelectedElectricianId(String selectedElectricianId) {
        this.selectedElectricianId = selectedElectricianId;
    }

    public ElectricianSummaryDto getSelectedElectrician() {
        return selectedElectrician;
    }

    public void setSelectedElectrician(ElectricianSummaryDto selectedElectrician) {
        this.selectedElectrician = selectedElectrician;
    }

    public Boolean getCustomerConfirmed() {
        return customerConfirmed;
    }

    public void setCustomerConfirmed(Boolean customerConfirmed) {
        this.customerConfirmed = customerConfirmed;
    }

    public Boolean getElectricianConfirmed() {
        return electricianConfirmed;
    }

    public void setElectricianConfirmed(Boolean electricianConfirmed) {
        this.electricianConfirmed = electricianConfirmed;
    }

    public int getInterestedCount() {
        return interestedCount;
    }

    public void setInterestedCount(int interestedCount) {
        this.interestedCount = interestedCount;
    }

    public List<InterestDto> getInterestedProviders() {
        return interestedProviders;
    }

    public void setInterestedProviders(List<InterestDto> interestedProviders) {
        this.interestedProviders = interestedProviders != null ? interestedProviders : new ArrayList<>();
        this.interestedCount = this.interestedProviders.size();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
