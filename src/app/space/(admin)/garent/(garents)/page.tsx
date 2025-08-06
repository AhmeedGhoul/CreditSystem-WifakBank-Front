import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/UsersTable/UsersTable";
import { Metadata } from "next";
import React from "react";
import LogsTable from "@/components/UsersTable/UsersTable";
import UsersTable from "@/components/UsersTable/UsersTable";
import GarentsTable from "@/components/garent/GarentsTable";

export const metadata: Metadata = {
    title: "Wifak Bank",
    description:
        "Wifak Bank",
};

export default function garents() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Garents" />
            <div className="space-y-6">
                <ComponentCard title="Garents Overview">
                    <GarentsTable />
                </ComponentCard>
            </div>
        </div>
    );
}
