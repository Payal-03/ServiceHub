package com.servicehub.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class ExpressInterestDto {

    private BigDecimal bidAmount;
    private BigDecimal quotedAmount; // Frontend alias

    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;
    private String note; // Frontend alias

    public ExpressInterestDto() {
    }

    public BigDecimal getResolvedBidAmount() {
        if (bidAmount != null) return bidAmount;
        if (quotedAmount != null) return quotedAmount;
        return BigDecimal.ZERO;
    }

    public String getResolvedMessage() {
        if (message != null && !message.trim().isEmpty()) return message.trim();
        if (note != null && !note.trim().isEmpty()) return note.trim();
        return "";
    }

    // Getters and Setters
    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public BigDecimal getQuotedAmount() {
        return quotedAmount;
    }

    public void setQuotedAmount(BigDecimal quotedAmount) {
        this.quotedAmount = quotedAmount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
