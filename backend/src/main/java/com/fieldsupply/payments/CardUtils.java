package com.fieldsupply.payments;

public final class CardUtils {

    private CardUtils() {
    }

    public static boolean luhnValid(String cardNumber) {
        String digits = cardNumber == null ? "" : cardNumber.replaceAll("\\D", "");
        if (digits.length() < 13 || digits.length() > 19) return false;

        int sum = 0;
        boolean alternate = false;
        for (int i = digits.length() - 1; i >= 0; i--) {
            int n = digits.charAt(i) - '0';
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }

    public static String detectBrand(String cardNumber) {
        String digits = cardNumber == null ? "" : cardNumber.replaceAll("\\D", "");
        if (digits.startsWith("4")) return "Visa";
        if (digits.matches("^5[1-5].*")) return "Mastercard";
        if (digits.matches("^3[47].*")) return "Amex";
        return "Card";
    }

    public static String last4(String cardNumber) {
        String digits = cardNumber == null ? "" : cardNumber.replaceAll("\\D", "");
        return digits.length() >= 4 ? digits.substring(digits.length() - 4) : digits;
    }

    public static boolean expiryValid(String mm, String yy) {
        try {
            int month = Integer.parseInt(mm);
            int year = 2000 + Integer.parseInt(yy);
            if (month < 1 || month > 12) return false;
            java.time.YearMonth expiry = java.time.YearMonth.of(year, month);
            return !expiry.isBefore(java.time.YearMonth.now());
        } catch (Exception e) {
            return false;
        }
    }
}
