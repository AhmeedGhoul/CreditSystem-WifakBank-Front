"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function BalanceOverviewDashboard({ balance }: { balance: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const maxBalance = 50000;
    const percentage = Math.min((balance / maxBalance) * 100, 100);

    const series = [percentage];
    const options: ApexOptions = {
        colors: ["#465FFF"], // primary blue accent
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            height: 250,
            sparkline: { enabled: true },
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: { size: "65%" },
                track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
                dataLabels: {
                    name: { show: true, fontSize: "14px", color: "#475569", offsetY: 15 },
                    value: {
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#1E293B",
                        offsetY: -15,
                        formatter: (val) => `$${balance.toFixed(2)}`,
                    },
                },
            },
        },
        fill: {
            type: "solid",
            colors: ["#465FFF"],
        },
        stroke: { lineCap: "round" },
        labels: ["Balance"],
    };

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }
    function closeDropdown() {
        setIsOpen(false);
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] shadow-lg">
            <div className="px-6 pt-6 pb-12 bg-white shadow-default rounded-t-2xl dark:bg-gray-900">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Current Balance</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                            Track your funds effortlessly and clearly
                        </p>
                    </div>
                    <div className="relative inline-block">
                        <button
                            onClick={toggleDropdown}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            aria-label="Options"
                        >
                            <MoreDotIcon className="w-6 h-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-36 p-2">
                            <DropdownItem
                                tag="button"
                                onItemClick={closeDropdown}
                                className="text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                Refresh
                            </DropdownItem>
                            <DropdownItem
                                tag="button"
                                onItemClick={closeDropdown}
                                className="text-red-600 hover:bg-red-100 rounded-lg dark:hover:bg-red-900/30"
                            >
                                Clear Balance
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
                <div className="max-w-xs mx-auto">
                    <ReactApexChart options={options} series={series} type="radialBar" height={250} />
                </div>
            </div>

            <div className="flex justify-around bg-gray-50 dark:bg-gray-800 rounded-b-2xl py-4 text-gray-700 dark:text-gray-300">
                <div className="text-center">
                    <p className="text-xs font-medium">Goal</p>
                    <p className="font-semibold text-lg">$50,000</p>
                </div>
                <div className="text-center border-l border-r border-gray-200 dark:border-gray-700 px-4">
                    <p className="text-xs font-medium">Today</p>
                    <p className="font-semibold text-lg">$1,250</p>
                </div>
                <div className="text-center">
                    <p className="text-xs font-medium">Change</p>
                    <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">+8%</p>
                </div>
            </div>
        </div>
    );
}
