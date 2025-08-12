"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, BoxIconLine } from "@/icons";
import { fetchUserStats, UserStats } from "@/api/user";

export const UserMetrics = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats()
        .then(setStats)
        .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>Loading stats...</div>;

  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Total Users */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.totalUsers}</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              {/* Could calculate % change, here static for example */}
              5.2%
            </Badge>
          </div>
        </div>

        {/* Active Users Last Month */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Active Users (Last Month)</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.activeUsersLastMonth}</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              3.8%
            </Badge>
          </div>
        </div>

        {/* Total Contracts */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Contracts</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.totalContracts}</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              2.1%
            </Badge>
          </div>
        </div>

        {/* Total Contract Amount */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Contract Value (DT)</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {stats.totalContractAmount.toFixed(2)}
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              4.6%
            </Badge>
          </div>
        </div>
      </div>
  );
};
