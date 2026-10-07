package com.servicehub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "default_city", length = 100)
    private String defaultCity;

    @Column(name = "default_locality", length = 100)
    private String defaultLocality;

    @Column(name = "default_address", length = 255)
    private String defaultAddress;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Customer() {
    }

    public Customer(User user) {
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
