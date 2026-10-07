package com.servicehub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = {
    @UniqueConstraint(name = "uk_request_reviewer", columnNames = {"request_id", "reviewer_user_id"})
})
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_user_id", nullable = false)
    private User reviewerUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_user_id", nullable = false)
    private User revieweeUser;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "review", length = 500)
    private String review;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Rating() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

    public ServiceRequest getRequest() {
        return request;
    }

    public void setRequest(ServiceRequest request) {
        this.request = request;
    }

    public User getReviewerUser() {
        return reviewerUser;
    }

    public void setReviewerUser(User reviewerUser) {
        this.reviewerUser = reviewerUser;
    }

    public User getRevieweeUser() {
        return revieweeUser;
    }

    public void setRevieweeUser(User revieweeUser) {
        this.revieweeUser = revieweeUser;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
