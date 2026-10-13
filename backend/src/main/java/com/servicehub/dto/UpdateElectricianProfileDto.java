package com.servicehub.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class UpdateElectricianProfileDto {

    private String name;
    private String phone;

    @Size(max = 255, message = "Skills must not exceed 255 characters")
    private String skills;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String serviceCity;

    @Size(max = 100, message = "Locality must not exceed 100 characters")
    private String serviceLocality;

    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 60, message = "Experience years is invalid")
    private Integer experienceYears;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private String bio; // Alias for description in frontend

    public UpdateElectricianProfileDto() {
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
        return description != null ? description : bio;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
