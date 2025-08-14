"use client";
import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import {fetchPaymentMethods, addMoneyToBalance, performStripeTopUp} from '@/api/accountMoney';
import { Button } from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount: number) => void;
}

export default function AddMoneyModal({ isOpen, onClose, onSuccess }: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [methods, setMethods] = useState<{ id: string; card: { brand: string; last4: string } }[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        fetchPaymentMethods()
            .then(res => setMethods(res.data))
            .catch(console.error);
    }, [isOpen]);

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            await performStripeTopUp(amount, selectedId, stripe!, elements!);
            onSuccess(amount);
            onClose();
        } catch (err: any) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div
                className="relative z-50 w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
                role="dialog"
                aria-modal="true"
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Money to Your Account</h2>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Card
                </label>
                <select
                    className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    <option value="">Choose a card...</option>
                    {methods.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.card.brand.toUpperCase()} •••• {m.card.last4}
                        </option>
                    ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                </label>
                <input
                    type="number"
                    min="1"
                    className="w-full p-2 mb-6 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter amount (e.g. 50)"
                />

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !selectedId || amount <= 0}
                        className="bg-green-600 text-white"
                    >
                        {submitting ? 'Processing...' : `Add $${amount}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
