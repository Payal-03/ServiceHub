package com.servicehub.dto;

import java.time.LocalDateTime;

public class ElectricianProfileDto {

    private String id;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String skills;
    private String serviceCity;
    private String serviceLocality;
    private Integer experienceYears;
    private String description;
    private String bio; // Alias for description in frontend
    private Double rating;
    private Long ratingCount;
    private Long jobCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ElectricianProfileDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getServiceCity() {
        return serviceCity;
    }

    public void setServiceCity(String serviceCity) {
        this.serviceCity = serviceCity;
    }

    public String getServiceLocality() {
        return serviceLocality;
    }

    public void setServiceLocality(String serviceLocality) {
        this.serviceLocality = serviceLocality;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.bio = description;
    }

    public String getBio() {
        return bio != null ? bio : description;
    }

    public void setBio(String bio) {
        this.bio = bio;
        if (this.description == null) {
            this.description = bio;
        }
    }

    public Double getRating() {
        return rating != null ? rating : 5.0;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Long getRatingCount() {
        return ratingCount != null ? ratingCount : 0L;
    }

    public void setRatingCount(Long ratingCount) {
        this.ratingCount = ratingCount;
        this.jobCount = ratingCount;
    }

    public Long getJobCount() {
        return jobCount != null ? jobCount : (ratingCount != null ? ratingCount : 0L);
    }

    public void setJobCount(Long jobCount) {
        this.jobCount = jobCount;
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
