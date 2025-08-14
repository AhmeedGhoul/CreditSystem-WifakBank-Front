"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/UsersTable/UsersTable";
import { Metadata } from "next";
import React, {useEffect, useState} from "react";
import LogsTable from "@/components/UsersTable/UsersTable";
import {LockIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import CreditPool from "@/components/CreditPool/CreditPool";
import {parseJwt} from "@/lib/jwt";
import {checkUserAccess} from "@/api/user";


export default function creditPools() {
    const router = useRouter();
    const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
    const [isAgent, setIsAgent] = useState(false);
    const [isAuditor, setIsAuditor] = useState(false);
    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1];

                let roles: string[] = [];

                if (token) {
                    const decoded = parseJwt(token);
                    if (decoded?.roles) {
                        roles = decoded.roles;

                        const isAgentRole = roles.includes("Agent");
                        const isAuditorRole = roles.includes("Auditor");
                        const isAdminRole = roles.includes("Admin");

                        setIsAgent(isAgentRole);
                        setIsAuditor(isAuditorRole);

                        const accessGrantedByRequest = await checkUserAccess();
                        const isOnlyClient = roles.length === 1 && roles.includes("Client");

                        const finalAccess =
                            isAdminRole || isAgentRole || isAuditorRole || (isOnlyClient && accessGrantedByRequest);

                        setUserHasAccess(finalAccess);
                        return;
                    }
                }

                setUserHasAccess(false);
            } catch (error) {
                console.error("Error checking access:", error);
                setUserHasAccess(false);
            }
        };

        fetchAccess();
    }, []);

    if (userHasAccess === null) return null;


    return (
    <div>

        <PageBreadcrumb pageTitle="Credit Pools" />
          <ComponentCard title="Join a Credit Pool">
              <CreditPool userHasAccess={userHasAccess}/>
        </ComponentCard>
        </div>



  );
}
