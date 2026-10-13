package com.servicehub.dto;

import java.time.LocalDateTime;

public class RatingDto {

    private String id;
    private Long ratingId;
    private Long requestId;
    private String bookingId;
    private Long reviewerUserId;
    private String customerId;
    private String reviewerName;
    private String customerName;
    private Long revieweeUserId;
    private String providerId;
    private String revieweeName;
    private String providerName;
    private Integer score;
    private Integer rating;
    private String review;
    private String comment;
    private LocalDateTime createdAt;

    public RatingDto() {
    }

    public String getId() {
        return id != null ? id : (ratingId != null ? String.valueOf(ratingId) : null);
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
        this.id = String.valueOf(ratingId);
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
        this.bookingId = requestId != null ? String.valueOf(requestId) : null;
    }

    public String getBookingId() {
        return bookingId != null ? bookingId : (requestId != null ? String.valueOf(requestId) : null);
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Long getReviewerUserId() {
        return reviewerUserId;
    }

    public void setReviewerUserId(Long reviewerUserId) {
        this.reviewerUserId = reviewerUserId;
        this.customerId = reviewerUserId != null ? String.valueOf(reviewerUserId) : null;
    }

    public String getCustomerId() {
        return customerId != null ? customerId : (reviewerUserId != null ? String.valueOf(reviewerUserId) : null);
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
        this.customerName = reviewerName;
    }

    public String getCustomerName() {
        return customerName != null ? customerName : reviewerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getRevieweeUserId() {
        return revieweeUserId;
    }

    public void setRevieweeUserId(Long revieweeUserId) {
        this.revieweeUserId = revieweeUserId;
        this.providerId = revieweeUserId != null ? String.valueOf(revieweeUserId) : null;
    }

    public String getProviderId() {
        return providerId != null ? providerId : (revieweeUserId != null ? String.valueOf(revieweeUserId) : null);
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getRevieweeName() {
        return revieweeName;
    }

    public void setRevieweeName(String revieweeName) {
        this.revieweeName = revieweeName;
        this.providerName = revieweeName;
    }

    public String getProviderName() {
        return providerName != null ? providerName : revieweeName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
        this.rating = score;
    }

    public Integer getRating() {
        return rating != null ? rating : score;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
        this.score = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
        this.comment = review;
    }

    public String getComment() {
        return comment != null ? comment : review;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
