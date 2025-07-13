"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import SubmitRequestForm from "@/components/create-request/createRequest";

export default function SubmitRequestPage() {
    return (
        <div className="p-6">
            <PageBreadcrumb pageTitle="Submit Verification Request" />
            <ComponentCard title="Verification Request Form">
                <SubmitRequestForm />
            </ComponentCard>
        </div>
    );
}
