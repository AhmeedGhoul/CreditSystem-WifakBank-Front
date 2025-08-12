import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RequestsTable from "@/components/Requests/RequestsTable";

export const metadata = {
    title: "Requests",
    description: "Requests management",
};

export default function RequestsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Requests" />
            <div className="space-y-6">
                <ComponentCard title="Requests Overview">
                    <RequestsTable />
                </ComponentCard>
            </div>
        </div>
    );
}
