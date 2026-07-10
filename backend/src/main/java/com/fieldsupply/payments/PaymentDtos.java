package com.fieldsupply.payments;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.Instant;

public class PaymentDtos {

    public static class CreateIntentRequest {

        @DecimalMin(value = "0.01")
        private BigDecimal amount;

        @NotBlank
        private String currency = "USD";

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }
    }

    public static class ConfirmRequest {

        @NotBlank
        private String cardholderName;

        @NotBlank
        private String cardNumber;

        @NotBlank
        private String expiry; // MM/YY

        @NotBlank
        private String cvc;

        public String getCardholderName() {
            return cardholderName;
        }

        public void setCardholderName(String cardholderName) {
            this.cardholderName = cardholderName;
        }

        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getExpiry() {
            return expiry;
        }

        public void setExpiry(String expiry) {
            this.expiry = expiry;
        }

        public String getCvc() {
            return cvc;
        }

        public void setCvc(String cvc) {
            this.cvc = cvc;
        }
    }

    public record IntentResponse(
            String id,
            BigDecimal amount,
            String currency,
            PaymentStatus status,
            String cardBrand,
            String cardLast4,
            String failureReason,
            Instant createdAt
    ) {
        static IntentResponse from(PaymentIntent intent) {
            return new IntentResponse(
                    intent.getId(),
                    intent.getAmount(),
                    intent.getCurrency(),
                    intent.getStatus(),
                    intent.getCardBrand(),
                    intent.getCardLast4(),
                    intent.getFailureReason(),
                    intent.getCreatedAt()
            );
        }
    }
}
