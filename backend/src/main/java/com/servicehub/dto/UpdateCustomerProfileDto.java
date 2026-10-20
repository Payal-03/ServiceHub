package com.servicehub.dto;

public class UpdateCustomerProfileDto {

    private String fullName;
    private String phone;
    private String defaultCity;
    private String defaultLocality;
    private String defaultAddress;

    public UpdateCustomerProfileDto() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDefaultCity() {
        return defaultCity;
    }

    public void setDefaultCity(String defaultCity) {
        this.defaultCity = defaultCity;
    }

    public String getDefaultLocality() {
        return defaultLocality;
    }

    public void setDefaultLocality(String defaultLocality) {
        this.defaultLocality = defaultLocality;
    }

    public String getDefaultAddress() {
        return defaultAddress;
    }

    public void setDefaultAddress(String defaultAddress) {
        this.defaultAddress = defaultAddress;
    }
}
