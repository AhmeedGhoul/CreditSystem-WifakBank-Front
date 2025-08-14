import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/UsersTable/UsersTable";
import { Metadata } from "next";
import React from "react";
import LogsTable from "@/components/UsersTable/UsersTable";
import UsersTable from "@/components/UsersTable/UsersTable";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default function users() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users Overview">
          <UsersTable />
        </ComponentCard>
      </div>
    </div>
  );
}
