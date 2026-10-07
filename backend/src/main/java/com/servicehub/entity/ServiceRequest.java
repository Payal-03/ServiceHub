package com.servicehub.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_electrician_id")
    private ElectricianProfile selectedElectrician;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "locality", nullable = false, length = 100)
    private String locality;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "expected_budget", nullable = false, precision = 10, scale = 2)
    private BigDecimal expectedBudget;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RequestStatus status = RequestStatus.OPEN;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "customer_confirmed", nullable = false)
    private Boolean customerConfirmed = false;

    @Column(name = "electrician_confirmed", nullable = false)
    private Boolean electricianConfirmed = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ServiceRequest() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RequestStatus.OPEN;
        }
        if (this.customerConfirmed == null) {
            this.customerConfirmed = false;
        }
        if (this.electricianConfirmed == null) {
            this.electricianConfirmed = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public void setCategory(ServiceCategory category) {
        this.category = category;
    }

    public ElectricianProfile getSelectedElectrician() {
        return selectedElectrician;
    }

    public void setSelectedElectrician(ElectricianProfile selectedElectrician) {
        this.selectedElectrician = selectedElectrician;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public BigDecimal getExpectedBudget() {
        return expectedBudget;
    }

    public void setExpectedBudget(BigDecimal expectedBudget) {
        this.expectedBudget = expectedBudget;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
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
