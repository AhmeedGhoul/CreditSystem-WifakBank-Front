"use client";
import React, { useEffect, useState } from "react";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useElements,
    useStripe,
    Elements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { createAccount } from "@/api/accountMoney";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { stripePromise } from "@/lib/stripe";
import {Button} from "@/components/ui/button";

function AccountMoneyForm({ userId }: { userId: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const match = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(match.matches);
        const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        match.addEventListener("change", listener);
        return () => match.removeEventListener("change", listener);
    }, []);

    const stripeStyle = {
        style: {
            base: {
                fontSize: "16px",
                color: isDarkMode ? "#f5f5f5" : "#111",
                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                '::placeholder': {
                    color: isDarkMode ? "#aaa" : "#888",
                },
            },
            invalid: {
                color: "#e53e3e",
            },
        },
    };

    const handleSubmit = async () => {
        if (!stripe || !elements) return;
        setIsSubmitting(true);

        try {
            const card = elements.getElement(CardNumberElement);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-setup-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const { client_secret } = await res.json();
            const result = await stripe.confirmCardSetup(client_secret, {
                payment_method: { card: card! },
            });

            if (result.error) {
                alert("❌ Card registration failed: " + result.error.message);
                setIsSubmitting(false);
                return;
            }

            await createAccount({
                stripePaymentIntentId: result.setupIntent!.payment_method as string,
            });

            alert("✅ Account + card saved");
            router.push("/space/creditPool");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Payment" />
            <ComponentCard title="Add Card to Account">
                <div className="space-y-4 text-black dark:text-white rounded-lg p-6 bg-white dark:bg-gray-900 shadow-sm">
                    <div>
                        <label className="text-sm mb-1 block">Card Number</label>
                        <div className="p-3 border rounded bg-white dark:bg-gray-800">
                            <CardNumberElement options={stripeStyle} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm mb-1 block">Expiration Date</label>
                            <div className="p-3 border rounded bg-white dark:bg-gray-800">
                                <CardExpiryElement options={stripeStyle} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm mb-1 block">CVC</label>
                            <div className="p-3 border rounded bg-white dark:bg-gray-800">
                                <CardCvcElement options={stripeStyle} />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={!stripe || isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Saving..." : "Save Card"}
                        </Button>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}

export default function AccountMoney(props: { userId: number }) {
    return (
        <Elements stripe={stripePromise}>
            <AccountMoneyForm {...props} />
        </Elements>
    );
}
