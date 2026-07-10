import React, { useState, useMemo, useRef, useEffect } from "react";
import { CreditCard, Lock, Check, ChevronLeft } from "lucide-react";

const INK = "#141B2E";
const CARD_NAVY = "#1B2340";
const CANVAS = "#F5F3EE";
const CORAL = "#E0623F";
const MUTED = "#8B8A82";
const LINE = "#E4E1D6";

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnValid(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function SuccessCheck() {
  const pathRef = useRef(null);
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    el.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
      duration: 500,
      delay: 150,
      easing: "cubic-bezier(0.65,0,0.35,1)",
      fill: "forwards",
    });
  }, []);

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" stroke="#2F6B4F" strokeWidth="2" opacity="0.25" />
      <path ref={pathRef} d="M20 37l11 11 21-23" stroke="#2F6B4F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PaymentCheckout() {
  const [step, setStep] = useState("form"); // form | processing | success | error
  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});

  const amount = 128.0;

  const update = (field) => (e) => {
    const raw = e.target.value;
    const value = field === "number" ? formatCardNumber(raw) : field === "expiry" ? formatExpiry(raw) : raw;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const cardBrand = useMemo(() => {
    const digits = form.number.replace(/\D/g, "");
    if (digits.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "Amex";
    return "Card";
  }, [form.number]);

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter the name on the card";
    if (!luhnValid(form.number)) next.number = "Card number looks invalid";
    const [mm, yy] = form.expiry.split("/");
    if (!mm || !yy || Number(mm) < 1 || Number(mm) > 12) next.expiry = "Invalid expiry";
    if (form.cvc.length < 3) next.cvc = "Invalid CVC";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStep("processing");
    setTimeout(() => {
      setStep("success");
    }, 1800);
  };

  const reset = () => {
    setStep("form");
    setForm({ name: "", number: "", expiry: "", cvc: "" });
    setErrors({});
    setFlipped(false);
  };

  return (
    <div style={{ background: CANVAS, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }} className="flex items-center justify-center p-6">
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div className="mb-5 flex items-center gap-2">
          <span style={{ color: INK }} className="text-lg font-bold tracking-tight">
            Checkout
          </span>
          <span style={{ color: MUTED }} className="text-xs font-mono">
            #ORD-3391
          </span>
        </div>

        <div style={{ perspective: 1000 }} className="mb-6">
          <div
            style={{
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transformStyle: "preserve-3d",
              transition: "transform 500ms cubic-bezier(0.65,0,0.35,1)",
              height: 210,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                background: `linear-gradient(135deg, ${CARD_NAVY}, #0D1226)`,
                borderRadius: 16,
                padding: "22px 24px",
                color: "#F1EFE8",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="flex items-center justify-between">
                <CreditCard size={26} strokeWidth={1.5} />
                <span className="text-xs font-semibold tracking-widest opacity-80">{cardBrand.toUpperCase()}</span>
              </div>
              <div style={{ fontFamily: "monospace", letterSpacing: "0.08em" }} className="text-xl">
                {form.number || "•••• •••• •••• ••••"}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] opacity-60 uppercase tracking-wide">Card holder</div>
                  <div className="text-sm">{form.name || "Your name"}</div>
                </div>
                <div>
                  <div className="text-[10px] opacity-60 uppercase tracking-wide">Expires</div>
                  <div className="text-sm font-mono">{form.expiry || "MM/YY"}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: `linear-gradient(135deg, ${CARD_NAVY}, #0D1226)`,
                borderRadius: 16,
                paddingTop: 18,
              }}
            >
              <div style={{ background: "#0A0D1A", height: 34, width: "100%" }} />
              <div className="px-6 mt-6 flex justify-end">
                <div style={{ background: "#F1EFE8", borderRadius: 4, padding: "6px 14px" }} className="text-sm font-mono text-black">
                  {form.cvc || "•••"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16 }} className="p-5 relative overflow-hidden">
          {step === "form" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label style={{ color: MUTED }} className="text-xs mb-1 block">
                  Name on card
                </label>
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Alex Rivera"
                  style={{ borderColor: errors.name ? CORAL : LINE }}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                {errors.name && <p style={{ color: CORAL }} className="text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="mb-3">
                <label style={{ color: MUTED }} className="text-xs mb-1 block">
                  Card number
                </label>
                <input
                  value={form.number}
                  onChange={update("number")}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  style={{ borderColor: errors.number ? CORAL : LINE }}
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400"
                />
                {errors.number && <p style={{ color: CORAL }} className="text-xs mt-1">{errors.number}</p>}
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label style={{ color: MUTED }} className="text-xs mb-1 block">
                    Expiry
                  </label>
                  <input
                    value={form.expiry}
                    onChange={update("expiry")}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    style={{ borderColor: errors.expiry ? CORAL : LINE }}
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400"
                  />
                  {errors.expiry && <p style={{ color: CORAL }} className="text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div className="flex-1">
                  <label style={{ color: MUTED }} className="text-xs mb-1 block">
                    CVC
                  </label>
                  <input
                    value={form.cvc}
                    onChange={update("cvc")}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    placeholder="123"
                    inputMode="numeric"
                    maxLength={4}
                    style={{ borderColor: errors.cvc ? CORAL : LINE }}
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400"
                  />
                  {errors.cvc && <p style={{ color: CORAL }} className="text-xs mt-1">{errors.cvc}</p>}
                </div>
              </div>

              <button
                type="submit"
                style={{ background: INK }}
                className="w-full text-white rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <Lock size={14} />
                Pay ${amount.toFixed(2)}
              </button>
              <p style={{ color: MUTED }} className="text-[11px] text-center mt-3">
                This is a demo form — no real payment is processed.
              </p>
            </form>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-10">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `3px solid ${LINE}`,
                  borderTopColor: INK,
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
              <p style={{ color: MUTED }} className="text-sm mt-4">
                Processing payment…
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6">
              <SuccessCheck />
              <p style={{ color: INK }} className="text-base font-semibold mt-3">
                Payment successful
              </p>
              <p style={{ color: MUTED }} className="text-sm mt-1">
                ${amount.toFixed(2)} charged to {cardBrand} ending in {form.number.slice(-4)}
              </p>
              <button
                onClick={reset}
                style={{ borderColor: LINE }}
                className="mt-5 flex items-center gap-1 text-sm border rounded-lg px-4 py-2 text-gray-600"
              >
                <ChevronLeft size={14} />
                New payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
