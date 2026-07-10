package com.fieldsupply.payments;

import java.math.BigDecimal;
import java.time.Instant;

public class PaymentIntent {

    private final String id;
    private final BigDecimal amount;
    private final String currency;
    private final Instant createdAt;
    private PaymentStatus status;
    private String cardBrand;
    private String cardLast4;
    private String failureReason;

    public PaymentIntent(String id, BigDecimal amount, String currency) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.status = PaymentStatus.REQUIRES_PAYMENT;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getCardBrand() {
        return cardBrand;
    }

    public void setCardBrand(String cardBrand) {
        this.cardBrand = cardBrand;
    }

    public String getCardLast4() {
        return cardLast4;
    }

    public void setCardLast4(String cardLast4) {
        this.cardLast4 = cardLast4;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
}
