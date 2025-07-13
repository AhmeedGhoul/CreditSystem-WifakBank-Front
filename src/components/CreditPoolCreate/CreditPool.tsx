"use client";

import React, { useState, useMemo } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { createCreditPool } from "@/api/creditPool";

export default function CreateCreditPoolForm() {
    const [formData, setFormData] = useState({
        Frequency: "1",
        Period: "3",
        FinalValue: "",
    });

    // ⚙️ Phrase calculée dynamiquement
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

            return `🧮 You will pay ${amountPerStep.toFixed(2)} DT every ${frequency} month(s), over a period of ${period} months, to receive ${finalValue} DT.`;
        }

        return "";
    }, [formData]);

    const handleSubmit = async () => {
        try {
            const payload = {
                Frequency: parseInt(formData.Frequency),
                Period: parseInt(formData.Period),
                FinalValue: parseInt(formData.FinalValue),
            };

            const result = await createCreditPool(payload);
            console.log("✅ Pool Created:", result);
        } catch (error) {
            console.error("❌ Error creating pool:", error);
        }
    };

    return (
        <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label>Final Value (TND)</Label>
                <Input
                    type="number"
                    value={formData.FinalValue}
                    onChange={(e) =>
                        setFormData({ ...formData, FinalValue: e.target.value })
                    }
                />
            </div>

            <div>
                <Label>Period (months)</Label>
                <Input
                    type="number"
                    value={formData.Period}
                    onChange={(e) =>
                        setFormData({ ...formData, Period: e.target.value })
                    }
                />
            </div>

            <div>
                <Label>Frequency (months)</Label>
                <Input
                    type="number"
                    value={formData.Frequency}
                    onChange={(e) =>
                        setFormData({ ...formData, Frequency: e.target.value })
                    }
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
                    className="px-6 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition shadow"
                    onClick={handleSubmit}
                >
                    Create Credit Pool
                </button>
            </div>
        </div>
    );
}
