"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";
import { BalanceOverview } from "@/components/AccountMoney/BalanceOverview";
import MonthlySalesChart from "../ecommerce/MonthlyPaymentsChart";
import { PaymentLogs } from "./PaymentLogs";
import MonthlyTarget from "../ecommerce/MonthlyTarget";
import { PaymentCards } from "@/components/AccountMoney/PaymentCards";
import { UserMetrics } from "@/components/ecommerce/UserMetrics";
import { Button } from "@/components/ui/button";
import AddMoneyModal from "@/components/AccountMoney/AddMoneyModal";
import { fetchBalance, fetchCalendarPayments, payCreditPoolPayment } from "@/api/accountMoney";
import { toast } from "sonner";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { parseJwt } from "@/lib/jwt";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type CalendarEvent = {
    title: string;
    date: string;
    color: string;
    isPaid: boolean;
    paymentId: number;
};

export default function MoneyAccountDashboard({
                                                  userHasAccess,
                                                  balance,
                                                  logs,
                                                  cards,
                                              }: {
    userHasAccess: boolean;
    balance: number;
    logs: any[];
    cards: any[];
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(balance);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);

    const refreshDashboardData = useCallback(async () => {
        if (!userHasAccess) return;

        try {
            const balance = await fetchBalance();
            setCurrentBalance(balance);
        } catch {
            toast.error("Failed to load balance");
        }

        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];
        if (!token) return;

        const { sub: userId } = parseJwt(token);

        try {
            const data = await fetchCalendarPayments(userId);
            const mapped: CalendarEvent[] = data.map((event: any) => ({
                title: `${event.amount} DT need to be paid`,
                date: event.date,
                color: event.isPaid ? "#22c55e" : "#f97316",
                isPaid: event.isPaid,
                paymentId: event.paymentId,
            }));
            setCalendarEvents(mapped);
        } catch {
            toast.error("Failed to load calendar events");
        }
    }, [userHasAccess]);

    useEffect(() => {
        refreshDashboardData();
    }, [refreshDashboardData]);

    const renderEventContent = (eventInfo: any) => (
        <div
            className="text-xs px-1 py-0.5 rounded-md whitespace-normal leading-snug"
            style={{
                backgroundColor: eventInfo.backgroundColor || eventInfo.event.backgroundColor || "#e5e7eb",
                color: "#1f2937",
                fontWeight: "500",
                borderRadius: "6px",
                overflow: "hidden",
                fontSize: "0.75rem",
                lineHeight: "1rem",
            }}
        >
            {eventInfo.event.title}
        </div>
    );

    const handleEventClick = (info: any) => {
        setSelectedEvent(info.event.extendedProps);
        setShowPaymentDialog(true);
    };

    const handlePayment = async () => {
        if (!selectedEvent || selectedEvent.isPaid) return;

        try {
            await payCreditPoolPayment(selectedEvent.paymentId);
            toast.success("Payment successful");
            setShowPaymentDialog(false);
            await refreshDashboardData();
        } catch (e: any) {
            setShowPaymentDialog(false);

            let message = "Unexpected error";

            try {
                const parsed = JSON.parse(e.message);
                message = parsed.message || message;
            } catch {
                message = e.message || message;
            }

            if (message.toLowerCase().includes("not enough balance")) {
                setShowInsufficientFundsDialog(true);
            } else {
                toast.error(message);
            }
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700 transition"
                >
                    Add Money to Account
                </Button>
            </div>

            <div
                className={`grid grid-cols-12 gap-4 md:gap-6 ${
                    !userHasAccess ? "blur-sm opacity-40 pointer-events-none" : ""
                }`}
            >
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <BalanceOverview balance={currentBalance} />
                    <MonthlySalesChart />
                    <PaymentLogs logs={logs} />
                </div>

                <div className="col-span-12 xl:col-span-5 space-y-6">
                    <MonthlyTarget />
                    <PaymentCards cards={cards} />
                </div>

                <div className="col-span-12">
                    <UserMetrics />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-2">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            selectable={true}
                            height="auto"
                            contentHeight="auto"
                            fixedWeekCount={false}
                            events={calendarEvents}
                            eventContent={renderEventContent}
                            eventClick={handleEventClick}
                        />
                    </div>
                </div>
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

            <AddMoneyModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={async (addedAmount) => {
                    setIsOpen(false);
                    await refreshDashboardData();
                }}
            />

            {showPaymentDialog && selectedEvent && (
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Payment</DialogTitle>
                            <DialogDescription>
                                Do you want to pay {selectedEvent.title}?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setShowPaymentDialog(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handlePayment} className="bg-green-600 text-white">
                                Yes, Pay
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            <Dialog open={showInsufficientFundsDialog} onOpenChange={setShowInsufficientFundsDialog}>
                <DialogContent className="z-[9999]">
                    <DialogHeader>
                        <DialogTitle>Insufficient Funds</DialogTitle>
                        <DialogDescription>
                            You don't have enough money to make this payment. Please add more funds to your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowInsufficientFundsDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-green-600 text-white"
                            onClick={() => {
                                setShowInsufficientFundsDialog(false);
                                setIsOpen(true);
                            }}
                        >
                            Add Funds
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
