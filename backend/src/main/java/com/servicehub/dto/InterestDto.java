package com.servicehub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InterestDto {

    private Long interestId;
    private Long requestId;
    private Long electricianId;
    private String providerId; // Frontend alias
    private String electricianName;
    private String providerName; // Frontend alias
    private String electricianPhone;
    private String providerPhone; // Frontend alias
    private String electricianEmail;
    private String providerEmail; // Frontend alias
    private Double electricianRating;
    private Double providerRating; // Frontend alias
    private Integer electricianExperienceYears;
    private Integer providerExperienceYears; // Frontend alias
    private BigDecimal bidAmount;
    private BigDecimal quotedAmount; // Frontend alias
    private String status;
    private String message;
    private String note; // Frontend alias
    private LocalDateTime createdAt;
    private String expressedAt; // Frontend alias

    public InterestDto() {
    }

    public Long getInterestId() {
        return interestId;
    }

    public void setInterestId(Long interestId) {
        this.interestId = interestId;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Long getElectricianId() {
        return electricianId;
    }

    public void setElectricianId(Long electricianId) {
        this.electricianId = electricianId;
        this.providerId = electricianId != null ? String.valueOf(electricianId) : null;
    }

    public String getProviderId() {
        return providerId != null ? providerId : (electricianId != null ? String.valueOf(electricianId) : null);
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getElectricianName() {
        return electricianName;
    }

    public void setElectricianName(String electricianName) {
        this.electricianName = electricianName;
        this.providerName = electricianName;
    }

    public String getProviderName() {
        return providerName != null ? providerName : electricianName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getElectricianPhone() {
        return electricianPhone;
    }

    public void setElectricianPhone(String electricianPhone) {
        this.electricianPhone = electricianPhone;
        this.providerPhone = electricianPhone;
    }

    public String getProviderPhone() {
        return providerPhone != null ? providerPhone : electricianPhone;
    }

    public void setProviderPhone(String providerPhone) {
        this.providerPhone = providerPhone;
    }

    public String getElectricianEmail() {
        return electricianEmail;
    }

    public void setElectricianEmail(String electricianEmail) {
        this.electricianEmail = electricianEmail;
        this.providerEmail = electricianEmail;
    }

    public String getProviderEmail() {
        return providerEmail != null ? providerEmail : electricianEmail;
    }

    public void setProviderEmail(String providerEmail) {
        this.providerEmail = providerEmail;
    }

    public Double getElectricianRating() {
        return electricianRating;
    }

    public void setElectricianRating(Double electricianRating) {
        this.electricianRating = electricianRating;
        this.providerRating = electricianRating;
    }

    public Double getProviderRating() {
        return providerRating != null ? providerRating : (electricianRating != null ? electricianRating : 5.0);
    }

    public void setProviderRating(Double providerRating) {
        this.providerRating = providerRating;
    }

    public Integer getElectricianExperienceYears() {
        return electricianExperienceYears;
    }

    public void setElectricianExperienceYears(Integer electricianExperienceYears) {
        this.electricianExperienceYears = electricianExperienceYears;
        this.providerExperienceYears = electricianExperienceYears;
    }

    public Integer getProviderExperienceYears() {
        return providerExperienceYears != null ? providerExperienceYears : electricianExperienceYears;
    }

    public void setProviderExperienceYears(Integer providerExperienceYears) {
        this.providerExperienceYears = providerExperienceYears;
    }

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
        this.quotedAmount = bidAmount;
    }

    public BigDecimal getQuotedAmount() {
        return quotedAmount != null ? quotedAmount : bidAmount;
    }

    public void setQuotedAmount(BigDecimal quotedAmount) {
        this.quotedAmount = quotedAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
        this.note = message;
    }

    public String getNote() {
        return note != null ? note : message;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        if (createdAt != null) {
            this.expressedAt = createdAt.toString();
        }
    }

    public String getExpressedAt() {
        return expressedAt != null ? expressedAt : (createdAt != null ? createdAt.toString() : null);
    }

    public void setExpressedAt(String expressedAt) {
        this.expressedAt = expressedAt;
    }
}
