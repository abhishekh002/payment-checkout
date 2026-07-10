package com.fieldsupply.payments;

public class NoSuchIntentException extends RuntimeException {
    public NoSuchIntentException(String id) {
        super("No payment intent with id " + id);
    }
}
