package com.servicehub.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateRatingDto {

    private Long requestId;
    private String bookingId; // Frontend alias for requestId

    private Long revieweeUserId;
    private String providerId; // Frontend alias

    @Min(value = 1, message = "Rating score must be at least 1")
    @Max(value = 5, message = "Rating score cannot exceed 5")
    private Integer score;
    private Integer rating; // Frontend alias for score

    @Size(max = 500, message = "Review comment must not exceed 500 characters")
    private String review;
    private String comment; // Frontend alias for review

    public CreateRatingDto() {
    }

    public Long getResolvedRequestId() {
        if (requestId != null) return requestId;
        if (bookingId != null) {
            try {
                return Long.parseLong(bookingId);
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    public Integer getResolvedScore() {
        if (score != null) return score;
        if (rating != null) return rating;
        return 5;
    }

    public String getResolvedReview() {
        if (review != null && !review.trim().isEmpty()) return review.trim();
        if (comment != null && !comment.trim().isEmpty()) return comment.trim();
        return "";
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Long getRevieweeUserId() {
        return revieweeUserId;
    }

    public void setRevieweeUserId(Long revieweeUserId) {
        this.revieweeUserId = revieweeUserId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
