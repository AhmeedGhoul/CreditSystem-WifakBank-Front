// ✅ Updated RequestsTable component with:
// 1. Unique key for fragment
// 2. Document previews in modal viewer

"use client";

import Pagination from "@/components/LogsTable/Pagination";
import {approveRequestByAgent, approveRequestByAuditor, fetchRequests, getDocumentPreviewUrl} from "@/api/request";
import { Calendar } from "@/components/ui/Calendar/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { Employment } from "@/interface/request";
import { useEffect, useState } from "react";
import React from "react";
import DocumentPreviewModal from "@/components/DocumentPreview/documentPreview";
import {parseJwt} from "@/lib/jwt";
import {checkUserAccess} from "@/api/user";

export default function RequestsTable() {
    const [requests, setRequests] = useState<any[]>([]);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [documentModal, setDocumentModal] = useState<{ url: string; mimeType: string } | null>(null);
    const [search, setSearch] = useState("");
    const [isRequestApproved, setIsRequestApproved] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAgent, setIsAgent] = useState(false);
    const [isAuditor, setIsAuditor] = useState(false);
    const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
    const loadRequests = () => {
        const params: Record<string, string> = {
            page: page.toString(),
            size: "10",
        };
        if (search.trim()) params.search = search;
        if (isRequestApproved !== "") params.isRequestApproved = isRequestApproved;
        if (startDate) params.startDate = startDate.toISOString().split("T")[0];
        if (endDate) params.endDate = endDate.toISOString().split("T")[0];
        console.log(fetchRequests(params));
        fetchRequests(params)
            .then((res) => {
                setRequests(res.data || []);
                setTotalPages(res.totalPages || 1);
            })
            .catch((err) => console.error("Failed to load requests:", err));
    };


    const toggleExpand = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
    const handleApproveAsAgent = async (id: number) => {
        try {
            await approveRequestByAgent(id);
            loadRequests();
        } catch (err) {
            console.error("Agent approval failed:", err);
        }
    };
    useEffect(() => {
        const fetchAll = async () => {
            try {
                loadRequests();

                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1];

                let roles: string[] = [];
                if (token) {
                    const decoded = parseJwt(token);
                    if (decoded?.roles) {
                        roles = decoded.roles;
                        setIsAgent(roles.includes("Agent"));
                        setIsAuditor(roles.includes("Auditor"));
                        console.log(roles);
                    }
                }

                // Optional general access check
                const accessGrantedByRequest = await checkUserAccess();
                const isOnlyClient = roles.length === 1 && roles.includes("Client");
                const isAdmin = roles.includes("Admin");
                const finalAccess = isAdmin || isAgent||isAuditor || (isOnlyClient && accessGrantedByRequest);
                setUserHasAccess(finalAccess);

            } catch (error) {
                console.error("Error during fetchAll:", error);
                setUserHasAccess(false);
            }
        };

        fetchAll();
    }, [page, search, isRequestApproved, startDate, endDate]);


    const handleApproveAsAuditor = async (id: number) => {
        try {
            await approveRequestByAuditor(id);
            loadRequests();
        } catch (err) {
            console.error("Auditor approval failed:", err);
        }
    };
    return (
        <div className="overflow-hidden rounded-xl border bg-white dark:bg-white/[0.03] text-black dark:text-white">
            <div className="p-4 flex gap-4 flex-wrap items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded bg-transparent w-full md:w-64"
                />

                <select
                    value={isRequestApproved}
                    onChange={(e) => setIsRequestApproved(e.target.value)}
                    className="p-2 border rounded bg-white dark:bg-black"
                >
                    <option value="">All Status</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending/Rejected</option>
                </select>

                {[startDate, endDate].map((date, idx) => (
                    <Popover key={idx}>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-2 p-2 px-3 border rounded-md bg-white dark:bg-black text-sm cursor-pointer shadow-sm w-[150px]">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className="truncate">
                                    {date ? format(date, "yyyy-MM-dd") : idx === 0 ? "Start Date" : "End Date"}
                                </span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={idx === 0 ? setStartDate : setEndDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                ))}
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    <Table>
                        <TableHeader className="bg-white dark:bg-black sticky top-0 border-b">
                            <TableRow>
                                <TableCell className="px-4 py-2">Type</TableCell>
                                <TableCell className="px-4 py-2">Message</TableCell>
                                <TableCell className="px-4 py-2">Status</TableCell>
                                <TableCell className="px-4 py-2">Date</TableCell>
                                <TableCell className="px-4 py-2">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.length === 0 ? (
                                <TableRow>
                                    <td colSpan={5} className="text-center py-4">No requests found.</td>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
                                    <React.Fragment key={request.requestId}>
                                        <TableRow>
                                            <TableCell className="px-4 py-3">{request.purpose}</TableCell>
                                            <TableCell className="px-4 py-3">{request.otherAssets || "-"}</TableCell>
                                            <TableCell className="px-4 py-3">
                                                <Badge color={request.isRequestApprovedByAuditor && request.isRequestApprovedByAgent ? "success" : "warning"} size="sm">
                                                    {request.isRequestApprovedByAuditor && request.isRequestApprovedByAgent ? "Approved" : "Pending/Rejected"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                {new Date(request.requestDate).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    className="text-brand-600 hover:underline flex items-center gap-1"
                                                    onClick={() => toggleExpand(request.requestId)}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                        {expandedRow === request.requestId && (
                                            <TableRow>
                                                <td colSpan={5} className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div><strong>Employment:</strong> {request.employmentStatus}</div>
                                                        <div><strong>Years:</strong> {request.yearsOfEmployment}</div>
                                                        <div><strong>Monthly Income:</strong> {request.monthlyIncome} TND</div>
                                                        <div><strong>Loan Amount:</strong> {request.totalLoanAmount}</div>
                                                        <div><strong>Monthly Loan:</strong> {request.monthlyLoanPayments}</div>
                                                        <div><strong>Criminal Record:</strong> {request.hasCriminalRecord ? "Yes" : "No"}</div>
                                                        <div><strong>Business Owner:</strong> {request.ownsBusiness ? "Yes" : "No"}</div>
                                                        <div><strong>Estimated House:</strong> {request.estimatedHouseValue}</div>
                                                        <div><strong>Estimated Car:</strong> {request.estimatedCarValue}</div>
                                                        <div><strong>Bank Savings:</strong> {request.bankSavings}</div>
                                                        <div><strong>Other Income:</strong> {request.otherIncomeSources}</div>
                                                        <div className="col-span-2"><strong>Details:</strong> {request.otherAssets}</div>
                                                    </div>
                                                    {request.Documents?.length > 0 && (

                                                        <div className="mt-4">
                                                            <h4 className="font-semibold mb-2">Documents</h4>
                                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                                {request.Documents.map((doc: any, idx: number) => (
                                                                    <li key={idx}>
                                                                        <button
                                                                            className="text-blue-600 hover:underline"
                                                                            onClick={() => setDocumentModal({ url: getDocumentPreviewUrl(doc.documentId), mimeType: doc.mimeType })}
                                                                        >
                                                                            Document {idx + 1} - {new Date(doc.documentDate).toLocaleDateString()}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="mt-4 flex gap-2">
                                                        {isAgent && !request.isRequestApprovedByAgent && (
                                                            <button
                                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                                onClick={() => handleApproveAsAgent(request.requestId)}
                                                            >
                                                                Approve as Agent
                                                            </button>
                                                        )}
                                                        {isAuditor && !request.isRequestApprovedByAuditor && (
                                                            <button
                                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                                onClick={() => handleApproveAsAuditor(request.requestId)}
                                                            >
                                                                Approve as Auditor
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-center py-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            {/* Document Preview Modal */}
            {documentModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl overflow-hidden w-11/12 h-[80%] relative">
                        {documentModal && (
                            <DocumentPreviewModal
                                fileUrl={documentModal.url}
                                mimeType={documentModal.mimeType}
                                onClose={() => setDocumentModal(null)}
                            />
                        )}
                        <button
                            className="absolute top-2 right-2 text-black bg-white border rounded-full px-3 py-1 shadow hover:bg-gray-100"
                            onClick={() => setDocumentModal(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
