package com.servicehub.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CustomerProfileDto {

    private Long customerId;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String defaultCity;
    private String defaultLocality;
    private String defaultAddress;
    private LocalDateTime memberSince;
    private Double averageRating;
    private long totalRatingsCount;
    private long totalRequestsCount;
    private List<RatingDto> ratings;

    public CustomerProfileDto() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public LocalDateTime getMemberSince() {
        return memberSince;
    }

    public void setMemberSince(LocalDateTime memberSince) {
        this.memberSince = memberSince;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalRatingsCount() {
        return totalRatingsCount;
    }

    public void setTotalRatingsCount(long totalRatingsCount) {
        this.totalRatingsCount = totalRatingsCount;
    }

    public long getTotalRequestsCount() {
        return totalRequestsCount;
    }

    public void setTotalRequestsCount(long totalRequestsCount) {
        this.totalRequestsCount = totalRequestsCount;
    }

    public List<RatingDto> getRatings() {
        return ratings;
    }

    public void setRatings(List<RatingDto> ratings) {
        this.ratings = ratings;
    }
}
