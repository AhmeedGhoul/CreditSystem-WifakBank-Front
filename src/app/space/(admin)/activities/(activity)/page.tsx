import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/UsersTable/UsersTable";
import { Metadata } from "next";
import React from "react";
import LogsTable from "@/components/LogsTable/LogsTable";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Activities" />
      <div className="space-y-6">
        <ComponentCard title="Activities Overview">
          <LogsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
