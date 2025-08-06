import {Stripe, StripeElements} from "@stripe/stripe-js";

export async function createAccount(payload: {
    stripePaymentIntentId: string
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Account creation failed:", errorData);
        throw new Error("Failed to create account");
    }

    return response.json();
}

export async function checkIfAccountExists(userId: number): Promise<boolean> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/find/${userId}`, {
        credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.exists === true;
}
export async function fetchPaymentMethods() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/payment-methods`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch methods');
    return res.json();
}
export async function fetchBalance(): Promise<number> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/balance`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch balance");
    const data = await res.json();
    return data.balance;
}

export async function addMoneyToBalance(amount: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/add-money`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error('Failed to update balance');
}
export async function fetchCalendarPayments(userId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpoolpayment/calendar-events/${userId}`, {
        credentials: 'include',
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
    }

    return res.json();
}
export async function payCreditPoolPayment(paymentId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpoolpayment/pay/${paymentId}`, {
        method: 'PATCH',
        credentials: 'include',
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return res.json();
}

export async function performStripeTopUp(
    amount: number,
    paymentMethodId: string,
    stripe: Stripe,
    elements: StripeElements
): Promise<void> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-payment-intent`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
    });
console.log(paymentMethodId);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create payment intent.");
    }

    const { client_secret } = await res.json();

    const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethodId,
    });

    if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
    }
    await addMoneyToBalance(amount);
}
