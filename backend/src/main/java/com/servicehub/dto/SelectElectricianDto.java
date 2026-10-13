package com.servicehub.dto;

public class SelectElectricianDto {

    private Long electricianId;
    private String providerId; // Frontend alias

    public SelectElectricianDto() {
    }

    public Long getResolvedElectricianId() {
        if (electricianId != null) return electricianId;
        if (providerId != null) {
            try {
                return Long.parseLong(providerId);
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    public Long getElectricianId() {
        return electricianId;
    }

    public void setElectricianId(Long electricianId) {
        this.electricianId = electricianId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
}
