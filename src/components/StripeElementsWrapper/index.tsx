import { ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function StripeElementsWrapper({ children }: { children: ReactNode }) {
    return <Elements stripe={stripePromise}>{children}</Elements>;
}