package com.servicehub.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_interests", uniqueConstraints = {
    @UniqueConstraint(name = "uk_request_electrician", columnNames = {"request_id", "electrician_id"})
})
public class RequestInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interest_id")
    private Long interestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "electrician_id", nullable = false)
    private ElectricianProfile electrician;

    @Column(name = "bid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal bidAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private InterestStatus status = InterestStatus.INTERESTED;

    @Column(name = "message", length = 500)
    private String message;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public RequestInterest() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = InterestStatus.INTERESTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getInterestId() {
        return interestId;
    }

    public void setInterestId(Long interestId) {
        this.interestId = interestId;
    }

    public ServiceRequest getRequest() {
        return request;
    }

    public void setRequest(ServiceRequest request) {
        this.request = request;
    }

    public ElectricianProfile getElectrician() {
        return electrician;
    }

    public void setElectrician(ElectricianProfile electrician) {
        this.electrician = electrician;
    }

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public InterestStatus getStatus() {
        return status;
    }

    public void setStatus(InterestStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
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
