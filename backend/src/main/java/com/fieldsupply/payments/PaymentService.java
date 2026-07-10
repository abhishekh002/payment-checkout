package com.fieldsupply.payments;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PaymentService {

    private final Map<String, PaymentIntent> intents = new ConcurrentHashMap<>();

    public PaymentIntent createIntent(PaymentDtos.CreateIntentRequest request) {
        String id = "pi_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        PaymentIntent intent = new PaymentIntent(id, request.getAmount(), request.getCurrency());
        intents.put(id, intent);
        return intent;
    }

    public PaymentIntent get(String id) {
        PaymentIntent intent = intents.get(id);
        if (intent == null) throw new NoSuchIntentException(id);
        return intent;
    }

    /**
     * Simulates confirming a payment against a processor. In a real system this request
     * would never reach your own backend with a raw PAN — you'd tokenize the card client-side
     * (e.g. Stripe Elements / a hosted field) and only send the resulting token here. This is
     * a demo standing in for that round trip.
     */
    public PaymentIntent confirm(String id, PaymentDtos.ConfirmRequest request) {
        PaymentIntent intent = get(id);

        if (!CardUtils.luhnValid(request.getCardNumber())) {
            throw new InvalidCardException("Card number failed validation");
        }

        String[] parts = request.getExpiry().split("/");
        if (parts.length != 2 || !CardUtils.expiryValid(parts[0].trim(), parts[1].trim())) {
            throw new InvalidCardException("Card expiry is invalid or in the past");
        }

        if (request.getCvc() == null || !request.getCvc().matches("\\d{3,4}")) {
            throw new InvalidCardException("CVC is invalid");
        }

        intent.setStatus(PaymentStatus.PROCESSING);
        intent.setCardBrand(CardUtils.detectBrand(request.getCardNumber()));
        intent.setCardLast4(CardUtils.last4(request.getCardNumber()));

        simulateProcessingDelay();

        // Demo decision rule, mirrors Stripe's test-card convention: a card ending in 0002
        // simulates a decline so the frontend's failure state is reachable too.
        if (intent.getCardLast4().equals("0002")) {
            intent.setStatus(PaymentStatus.FAILED);
            intent.setFailureReason("Card declined by issuer");
        } else {
            intent.setStatus(PaymentStatus.SUCCEEDED);
        }

        return intent;
    }

    private void simulateProcessingDelay() {
        try {
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
