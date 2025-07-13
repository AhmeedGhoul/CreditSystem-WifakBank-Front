"use client";

import React, { useEffect, useState } from "react";
import { fetchCreditPools } from "@/api/creditPool";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/UsersTable/Pagination";
import Badge from "@/components/CreditPool/badge";
import SignContract from "@/components/contract/signContract";
import { parseJwt } from "@/lib/jwt";
import {fetchUserContracts} from "@/api/contract";



export default function CreditPoolBrowser() {
    const [pools, setPools] = useState<CreditPool[]>([]);
    const [userContracts, setUserContracts] = useState<Contract[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isFullFilter, setIsFullFilter] = useState<boolean | "">("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedPool, setSelectedPool] = useState<CreditPool | null>(null);
    const [showContractModal, setShowContractModal] = useState(false);

    const fetchContractsAndPools = async () => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];
        if (!token) return;

        const decoded = parseJwt(token);
        const uid = decoded?.sub;
        if (!uid) {
            return;
        }
        setUserId(uid);

        const params: Record<string, string> = {
            page: currentPage.toString(),
            size: "9",
        };
        if (isFullFilter !== "") {
            params.isFull = String(isFullFilter);
        }

        try {
            const [poolsRes, contractsRes] = await Promise.all([
                fetchCreditPools(params),
                fetchUserContracts(uid),
            ]);
            setPools(poolsRes.data);
            setTotalPages(poolsRes.totalPages);
            setUserContracts(contractsRes);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };


    useEffect(() => {
        fetchContractsAndPools();
    }, [currentPage, isFullFilter]);

    const handleJoinClick = (pool: CreditPool) => {
        setSelectedPool(pool);
        setShowContractModal(true);
    };

    const hasUserJoined = (poolId: number): boolean => {
        return userContracts.some(c => c.creditPoolId === poolId && c.userUserId === userId);
    };
    return (
        <div className="text-black dark:text-white max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
                <select
                    value={String(isFullFilter)}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") setIsFullFilter("");
                        else setIsFullFilter(val === "true");
                    }}
                    className="p-2 border rounded bg-white dark:bg-gray-800 text-sm shadow-sm"
                >
                    <option value="">All Circles</option>
                    <option value="false">Available</option>
                    <option value="true">Full</option>
                </select>
            </div>

            {pools.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No credit pools found.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
                    {pools.map((pool) => {
                        const steps = Math.floor(pool.Period / pool.Frequency);
                        const amountPerStep = steps > 0 ? pool.FinalValue / steps : 0;
                        const joined = hasUserJoined(pool.creditPoolId);
                            console.log(joined);
                        return (
                            <div
                                key={pool.creditPoolId}
                                className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all w-full max-w-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                        Circle #{pool.creditPoolId}
                                    </h2>
                                    <Badge variant={pool.isFull || joined ? "destructive" : "success"}>
                                        {pool.isFull ? "Full" : joined ? "Already Joined" : "Open"}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <div><span className="font-semibold">Period:</span> {pool.Period} months</div>
                                    <div><span className="font-semibold">Final Amount:</span> {pool.FinalValue} DT</div>
                                    <div><span className="font-semibold">You pay:</span> {amountPerStep.toFixed(2)} DT every {pool.Frequency} month(s)</div>
                                </div>

                                <Button
                                    className="mt-5 w-full font-medium tracking-wide"
                                    disabled={pool.isFull || joined}
                                    onClick={() => handleJoinClick(pool)}
                                >
                                    {pool.isFull ? "Unavailable (Full)" : joined ? "Already Joined" : "Join This Circle"}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-center mt-8">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <div className="mt-12 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                    Didn’t find a circle that suits you?
                </p>
                <a
                    href="creditPool/create"
                    className="inline-block mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold"
                >
                    Create Your Own Circle
                </a>
            </div>

            {showContractModal && selectedPool && (
                <SignContract
                    isOpen={showContractModal}
                    onClose={() => setShowContractModal(false)}
                    creditPoolId={selectedPool.creditPoolId}
                    frequency={selectedPool.Frequency}
                    period={selectedPool.Period}
                    finalValue={selectedPool.FinalValue}
                    onSubmitContract={(signatureData) => {
                        console.log("Signature:", signatureData);
                    }}
                />
            )}
        </div>
    );
}
