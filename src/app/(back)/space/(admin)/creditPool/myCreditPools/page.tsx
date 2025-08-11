"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import MyCreditPoolsList from "@/components/CreditPool/MyCreditPools";

export default function MycreditPools() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Credit Pools" />
            <ComponentCard title="Joined Credit Pools">
                <MyCreditPoolsList />
            </ComponentCard>
        </div>
    );
}
