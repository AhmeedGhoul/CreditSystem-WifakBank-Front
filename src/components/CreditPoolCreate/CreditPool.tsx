"use client";

import React, { useState, useMemo } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { createCreditPool } from "@/api/creditPool";
import { useRouter } from "next/navigation";

export default function CreateCreditPoolForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        Frequency: "1",
        Period: "3",
        FinalValue: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidInput =
        formData.Frequency &&
        formData.Period &&
        formData.FinalValue &&
        Number(formData.Frequency) > 0 &&
        Number(formData.Period) > 0 &&
        Number(formData.FinalValue) > 0;

    const calculationMessage = useMemo(() => {
        const frequency = parseInt(formData.Frequency);
        const period = parseInt(formData.Period);
        const finalValue = parseFloat(formData.FinalValue);

        if (
            !isNaN(frequency) &&
            !isNaN(period) &&
            !isNaN(finalValue) &&
            frequency > 0 &&
            period > 0
        ) {
            const steps = Math.floor(period / frequency);
            const amountPerStep = finalValue / steps;

            return `🧮 You will pay ${amountPerStep.toFixed(
                2
            )} DT every ${frequency} month(s), over a period of ${period} months, to receive ${finalValue} DT.`;
        }

        return "";
    }, [formData]);

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        if (!isValidInput) {
            setError("Please enter valid positive numbers for all fields.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                Frequency: parseInt(formData.Frequency),
                Period: parseInt(formData.Period),
                FinalValue: parseFloat(formData.FinalValue),
            };

            await createCreditPool(payload);
            setSuccess("✅ Credit pool created successfully!");

            setTimeout(() => {
                router.push("/space/creditPool");
            }, 2000);
        } catch (error: any) {
            setError(error.message || "❌ Error creating credit pool.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label>Final Value (TND)</Label>
                <Input
                    type="number"
                    min={1}
                    value={formData.FinalValue}
                    onChange={(e) =>
                        setFormData({ ...formData, FinalValue: e.target.value })
                    }
                    required
                />
            </div>

            <div>
                <Label>Period (months)</Label>
                <Input
                    type="number"
                    min={1}
                    value={formData.Period}
                    onChange={(e) => setFormData({ ...formData, Period: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label>Frequency (months)</Label>
                <Input
                    type="number"
                    min={1}
                    value={formData.Frequency}
                    onChange={(e) =>
                        setFormData({ ...formData, Frequency: e.target.value })
                    }
                    required
                />
            </div>

            <div className="md:col-span-2">
                {calculationMessage && (
                    <div className="p-4 text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-300 dark:border-blue-700 shadow">
                        {calculationMessage}
                    </div>
                )}
            </div>

            <div className="md:col-span-2">
                <button
                    type="button"
                    className={`px-6 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition shadow ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Credit Pool"}
                </button>

                {error && (
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                {success && (
                    <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </p>
                )}
            </div>
        </div>
    );
}
