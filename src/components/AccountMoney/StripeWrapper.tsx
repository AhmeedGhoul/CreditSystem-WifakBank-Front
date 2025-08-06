"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const stripePromise = loadStripe("pk_test_51RkWH2Ro0UL0M7R8Cxnxz3ro0ZIOlSa2NmQKZ4OOZKX58ZrymyQVDzraEtI2c4wNvJkqHQQBeiZ9A6rimvJIQMpW00cpsJyIPK");

export default function StripeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
}
