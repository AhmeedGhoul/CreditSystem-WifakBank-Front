"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";
import { checkUserAccess } from "@/api/user";
import { parseJwt } from "@/lib/jwt";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";

export default function Ecommerce() {
    const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
    const router = useRouter();
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

                        // ✅ Set individual states
                        setIsAgent(isAgentRole);
                        setIsAuditor(isAuditorRole);

                        // ✅ Log real values
                        console.log("Agent:", isAgentRole);
                        console.log("Auditor:", isAuditorRole);

                        // ✅ Access control
                        const accessGrantedByRequest = await checkUserAccess();
                        const isOnlyClient = roles.length === 1 && roles.includes("Client");

                        const finalAccess =
                            isAdminRole || isAgentRole || isAuditorRole || (isOnlyClient && accessGrantedByRequest);

                        setUserHasAccess(finalAccess);
                        return;
                    }
                }

                // No token or roles → access denied
                setUserHasAccess(false);
            } catch (error) {
                console.error("Error checking access:", error);
                setUserHasAccess(false);
            }
        };

        fetchAccess();
    }, []);

    if (userHasAccess === null) return null; // or loading spinner


    return (
        <div className="relative">
            <div
                className={`grid grid-cols-12 gap-4 md:gap-6 ${ 
                    !userHasAccess ? "blur-sm opacity-40 pointer-events-none" : ""
                }`}
            >
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <EcommerceMetrics />
                    <MonthlySalesChart />
                </div>
                <div className="col-span-12 xl:col-span-5">
                    <MonthlyTarget />
                </div>
                <div className="col-span-12">
                    <StatisticsChart />
                </div>
                <div className="col-span-12 xl:col-span-5">
                    <DemographicCard />
                </div>
                <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div>
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
        </div>
    );
}
