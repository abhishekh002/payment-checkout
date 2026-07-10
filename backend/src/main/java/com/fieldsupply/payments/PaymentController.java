package com.fieldsupply.payments;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/intents")
    public PaymentDtos.IntentResponse createIntent(@Valid @RequestBody PaymentDtos.CreateIntentRequest request) {
        return PaymentDtos.IntentResponse.from(paymentService.createIntent(request));
    }

    @GetMapping("/intents/{id}")
    public PaymentDtos.IntentResponse getIntent(@PathVariable String id) {
        return PaymentDtos.IntentResponse.from(paymentService.get(id));
    }

    @PostMapping("/intents/{id}/confirm")
    public PaymentDtos.IntentResponse confirm(@PathVariable String id, @Valid @RequestBody PaymentDtos.ConfirmRequest request) {
        return PaymentDtos.IntentResponse.from(paymentService.confirm(id, request));
    }

    @ExceptionHandler(NoSuchIntentException.class)
    public ResponseEntity<String> handleNoSuchIntent(NoSuchIntentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidCardException.class)
    public ResponseEntity<String> handleInvalidCard(InvalidCardException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
