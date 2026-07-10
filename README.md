# Interactive Payment Checkout

An animated card checkout — flip-on-CVC card preview, processing spinner, drawn checkmark success state — with a small Java backend behind it.

## What's inside

```
payment-checkout/
├── backend/          Java / Spring Boot payment API
│   ├── pom.xml
│   └── src/main/java/com/fieldsupply/payments/
│       ├── PaymentApplication.java     entry point
│       ├── PaymentIntent.java          checkout-in-progress model
│       ├── PaymentStatus.java          REQUIRES_PAYMENT / PROCESSING / SUCCEEDED / FAILED
│       ├── PaymentService.java         intent + confirm logic
│       ├── PaymentController.java      REST endpoints
│       ├── PaymentDtos.java            request/response shapes
│       ├── CardUtils.java              Luhn check, brand detection, expiry check
│       ├── NoSuchIntentException.java
│       └── InvalidCardException.java
└── frontend/
    ├── PaymentCheckout.jsx             talks to the backend over fetch
    └── PaymentCheckoutStandalone.jsx   no backend needed, simulated locally
```

Use `PaymentCheckoutStandalone.jsx` if you just want the animation in a project with no server (it fakes a 1.8s processing delay and always succeeds).
Use `PaymentCheckout.jsx` if you want real request/response round trips against a backend, including a reachable failure state.

## Running the backend

Requires Java 25+ and Maven.

```
cd backend
mvn spring-boot:run
```

Starts on `http://localhost:8081`. Endpoints:

| Method | Path                                  | Does |
|--------|----------------------------------------|------|
| POST   | `/api/payments/intents`               | create an intent — body `{ "amount": 128.00, "currency": "USD" }` |
| GET    | `/api/payments/intents/{id}`          | look up an intent's current status |
| POST   | `/api/payments/intents/{id}/confirm`  | submit card details and simulate processing — body `{ "cardholderName", "cardNumber", "expiry", "cvc" }` |

Try it with `4242 4242 4242 4242` for a success, or any number ending in `0002` for a simulated decline (same convention Stripe's test cards use) — that lets you see the frontend's error state too.

### Important — this is a demo, not a real payment processor

`confirm` accepts a raw card number and CVC directly, which is fine for a local demo but is **not** how you'd build this for production. In a real app:

- Card data should never touch your own backend. Use a processor's client-side tokenization (Stripe Elements, Braintree Drop-in, etc.) so the browser sends a token, not the PAN, and your server only ever sees that token.
- Never persist a CVC anywhere, even briefly — this backend doesn't, but it's worth calling out.
- You'd need PCI DSS compliance considerations the moment real cards are involved.

This backend exists to give the frontend something realistic to talk to (intent creation, an async-feeling confirm step, success/decline branching) — swap `PaymentService.confirm` for a real call to your processor's SDK when you're ready to go further.

## Running the frontend

Drop `PaymentCheckout.jsx` (or the standalone variant) into any React + Tailwind project with `lucide-react` installed:

```
npm install lucide-react
```

If using the connected version, update `API_BASE` at the top of the file if your backend isn't on `localhost:8081`, and start the backend before submitting a payment.

## How the animations work

No animation library required — everything runs on native browser APIs:

- **Card flip**: a CSS 3D transform (`rotateY` + `perspective` + `backface-visibility: hidden`) swaps between two absolutely-positioned faces when the CVC field is focused.
- **Processing spinner**: a single CSS `@keyframes` rotation on a bordered circle.
- **Success checkmark**: an SVG `<path>` animated with the Web Animations API, animating `stroke-dashoffset` from the path's full length to `0` so it draws itself in.
