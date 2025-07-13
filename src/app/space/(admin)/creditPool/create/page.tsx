"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/UsersTable/UsersTable";
import { Metadata } from "next";
import React from "react";
import LogsTable from "@/components/UsersTable/UsersTable";
import {LockIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import CreditPool from "@/components/CreditPool/CreditPool";
import CreateCreditPoolForm from "@/components/CreditPoolCreate/CreditPool";


export default function creditPools() {
    const router = useRouter();

    return (
    <div>
        <PageBreadcrumb pageTitle="Credit Pools" />
          <ComponentCard title="Create a Credit Pool">
              <CreateCreditPoolForm />
        </ComponentCard>

    </div>

  );
}
