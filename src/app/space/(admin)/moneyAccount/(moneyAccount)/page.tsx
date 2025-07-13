"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/components/UsersTable/UsersTable";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkUserAccess } from "@/api/user";

export default function CreditPoolsPage() {
    const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const access = await checkUserAccess();
                setUserHasAccess(access);
            } catch (error) {
                console.error("Access check failed:", error);
                setUserHasAccess(false);
            }
        };

        fetchAccess();
    }, []);

    if (userHasAccess === null) return null; // loading or placeholder

    return (
        <div>
            <PageBreadcrumb pageTitle="Users" />

            <div
                className={`space-y-6 ${
                    !userHasAccess ? "blur-sm opacity-40 pointer-events-none" : ""
                }`}
            >
                <ComponentCard title="Users Overview">
                    <UsersTable />
                </ComponentCard>
            </div>

            {!userHasAccess && (
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
        </div>
    );
}
