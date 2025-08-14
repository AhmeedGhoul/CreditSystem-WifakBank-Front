"use client";

import React, { useEffect, useState } from "react";
import Badge from "@/components/CreditPool/badge";
import {fetchMyCreditPools, leaveCreditPool, sendReplacementRequest} from "@/api/creditPool";
import LeavePoolButton from "@/components/LeavePoolButton/LeavePoolButton";

export default function MyCreditPoolsList() {
    const [pools, setPools] = useState<CreditPool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCreditPools()
            .then((data) => setPools(data))
            .catch((e) => console.error("Failed to fetch pools", e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center">Loading joined credit pools...</p>;

    if (!pools.length) return <p className="text-center text-gray-500">You haven't joined any credit pool yet.</p>;

    return (
        <div className="space-y-6">
            {pools.map((pool) => {
                const currentCount = pool.contracts?.length || 0;
                const max = pool.maxPeople || 0;
                const isFull = currentCount >= max;

                return (
                    <div
                        key={pool.creditPoolId}
                        className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] p-6 shadow-sm min-h-[220px]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                Credit Pool #{pool.creditPoolId}
                            </h3>
                            <Badge color={isFull ? "success" : "warning"}>
                                {isFull ? "Starting the circle" : "Waiting for people"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <span className="font-semibold">Period:</span> {pool.Period} days
                            </div>
                            <div>
                                <span className="font-semibold">Frequency:</span> {pool.Frequency} days
                            </div>
                            <div>
                                <span className="font-semibold">Final Value:</span> {pool.FinalValue} TND
                            </div>
                            <div>
                                <span className="font-semibold">Max Participants:</span> {pool.maxPeople}
                            </div>
                            <div>
                                <span className="font-semibold">Current Participants:</span> {currentCount} / {max}
                            </div>
                            <div>
                                <span className="font-semibold">Status:</span> {pool.isFull ? "Full" : "Open"}
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-4">
                            <LeavePoolButton
                                poolIsFull={pool.isFull}
                                onLeave={async () => {
                                    await leaveCreditPool(pool.creditPoolId);
                                    setPools((prev) => prev.filter((p) => p.creditPoolId !== pool.creditPoolId));
                                }}
                                onSendReplacement={async (email) => {
                                    await sendReplacementRequest(pool.creditPoolId, email);
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
