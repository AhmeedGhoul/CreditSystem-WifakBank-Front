"use client";
import React, { useEffect, useState } from "react";
import MoneyAccountDashboard from "@/components/AccountMoney/AccountMoney";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import StripeWrapper from "@/components/AccountMoney/StripeWrapper";
import { parseJwt } from "@/lib/jwt";
import { checkUserAccess } from "@/api/user";
import { checkIfAccountExists } from "@/api/accountMoney";
import MissingAccountModal from "@/components/MissingAccountModal/MissingAccountModal";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountMoneyPage() {
    const router = useRouter();

    const [dashboardData, setDashboardData] = useState({
        balance: 0,
        cards: [],
        logs: [],
    });

    const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [hasAccount, setHasAccount] = useState<boolean | null>(null);
    const [showMissingAccountModal, setShowMissingAccountModal] = useState(false);

    const [isAgent, setIsAgent] = useState(false);
    const [isAuditor, setIsAuditor] = useState(false);

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1];

                let roles: string[] = [];

                if (token) {
                    const decoded = parseJwt(token);
                    if (decoded?.roles) {
                        roles = decoded.roles;

                        const isAgentRole = roles.includes("Agent");
                        const isAuditorRole = roles.includes("Auditor");
                        const isAdminRole = roles.includes("Admin");

                        setIsAgent(isAgentRole);
                        setIsAuditor(isAuditorRole);

                        const uid = decoded?.sub;
                        setUserId(uid || null);

                        const accessGrantedByRequest = await checkUserAccess();
                        const isOnlyClient = roles.length === 1 && roles.includes("Client");

                        const finalAccess =
                            isAdminRole || isAgentRole || isAuditorRole || (isOnlyClient && accessGrantedByRequest);

                        setUserHasAccess(finalAccess);
                        return;
                    }
                }

                setUserHasAccess(false);
            } catch (error) {
                console.error("Error checking access:", error);
                setUserHasAccess(false);
            }
        };

        fetchAccess();
    }, []);

    useEffect(() => {
        const checkAccountAndFetchDashboard = async () => {
            if (!userHasAccess || !userId) return;

            try {
                const accountExists = await checkIfAccountExists(userId);
                setHasAccount(accountExists);

                if (!accountExists) {
                    setShowMissingAccountModal(true);
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/dashboard-data`, {
                    credentials: "include",
                });
                const data = await res.json();
                setDashboardData(data);
                console.log(dashboardData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        checkAccountAndFetchDashboard();
    }, [userHasAccess, userId]);
    useEffect(() => {
        console.log(dashboardData);
    }, [dashboardData]);

    if (userHasAccess === null) return null;
    return (
        <div>
            <div
                className={`${
                    !userHasAccess || hasAccount === false ? "blur-sm opacity-90 pointer-events-none" : ""
                }`}
            >
                <PageBreadcrumb pageTitle="Payment" />
                <ComponentCard title="Dashboard">
                    <StripeWrapper>
                        {hasAccount ? (
                            <MoneyAccountDashboard
                                userHasAccess={true}
                                balance={dashboardData.balance}
                                cards={dashboardData.cards}
                                logs={dashboardData.logs}
                            />
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                Please create your account to view dashboard details.
                            </div>
                        )}
                    </StripeWrapper>
                </ComponentCard>
            </div>

            {userHasAccess === false && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-white/90 dark:bg-black/80">
                    <div className="text-center px-6 py-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
                        <div className="flex justify-center mb-4">
                            <LockIcon className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            Access Restricted
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You need to submit a request to join our{" "}
                            <span className="font-semibold text-brand-600">Money Circle</span> system.
                        </p>
                        <button
                            onClick={() => router.push("/space/request/submitRequest")}
                            className="px-6 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition shadow"
                        >
                            Submit Request
                        </button>
                    </div>
                </div>
            )}

            <MissingAccountModal
                isOpen={showMissingAccountModal}
                onClose={() => setShowMissingAccountModal(false)}
            />
        </div>
    );
}
