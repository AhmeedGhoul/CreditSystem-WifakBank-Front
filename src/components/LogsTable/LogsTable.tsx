"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Pagination from "@/components/LogsTable/Pagination";
import { fetchLogs } from "@/api/logs";
import Badge from "../ui/badge/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/Calendar/Calendar";
import {CalendarIcon, Trash2, Pencil, CheckCircle, PlusCircle} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Button } from "@/components/ui/button";
import { fetchAudit, deleteAudit, modifyAudit, createAudit } from "@/api/audit";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {AuditStatus, AuditType} from "@/interface/audit";

export default function LogsTable() {
    const [logs, setLogs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [audits, setAudits] = useState<any[]>([]);
    const [auditPage, setAuditPage] = useState(1);
    const [auditTotalPages, setAuditTotalPages] = useState(1);
    const [editAuditId, setEditAuditId] = useState<number | null>(null);
    const [editAuditValues, setEditAuditValues] = useState<any>({});
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [outputFilter, setOutputFilter] = useState("");
    const [startDateAudit, setStartDateAudit] = useState<Date | undefined>();
    const [endDateAudit, setEndDateAudit] = useState<Date | undefined>();
    const [disableCreateAudit, setDisabledwCreateAudit] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const reloadLogs = () => {
        setIsLoading(true);
        const params: Record<string, string> = {
            page: currentPage.toString(),
            size: "10",
        };
        if (search.trim()) params.search = search;
        if (startDate) params.startDate = startDate.toISOString().split("T")[0];
        if (endDate) params.endDate = endDate.toISOString().split("T")[0];

        fetchLogs(params)
            .then((res) => {
                setLogs(res.data);
                setTotalPages(res.totalPages || 1);
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setIsLoading(false));
    };

    const reloadAudits = () => {
        const params: Record<string, string> = {
            page: auditPage.toString(),
            size: "10",
        };
        if (outputFilter.trim()) params.output = outputFilter;
        if (statusFilter) params.statusAudit = statusFilter;
        if (typeFilter) params.auditType = typeFilter;
        if (startDateAudit) params.startDate = startDateAudit.toISOString().split("T")[0];
        if (endDateAudit) params.endDate = endDateAudit.toISOString().split("T")[0];

        fetchAudit(params)
            .then((res) => {
                setAudits(res.data);
                setAuditTotalPages(res.totalPages || 1);
            })
            .catch((err) => console.error("Audit fetch error:", err));
    };

    useEffect(() => {
        reloadLogs();
    }, [search, startDate, endDate, currentPage]);

    useEffect(() => {
        reloadAudits();
    }, [auditPage, outputFilter, statusFilter, typeFilter, startDateAudit, endDateAudit]);

    const toggleEdit = (audit: any) => {
        setEditAuditId((prev) => (prev === audit.auditId ? null : audit.auditId));
        setEditAuditValues(audit);
    };

    const handleEditChange = (key: string, value: any) => {
        setEditAuditValues((prev: any) => ({ ...prev, [key]: value }));
    };

    const confirmEdit = async () => {
        if (!editAuditId) return;
        try {
            const activityLogIds = (editAuditValues.activityLogs || []).map((log: any) => log.activityLogId);
            const payload = {
                ...editAuditValues,
                activityLogIds,
            };

            await modifyAudit(editAuditId, payload);
            setEditAuditId(null);
            setEditAuditValues({});
            setSelectedLogs([]);
            reloadAudits();
        } catch (err) {
            console.error("Edit audit error:", err);
        }
    };

    const handleDeleteAudit = async (auditId: number) => {
        if (!confirm("Are you sure you want to delete this audit?")) return;
        try {
            await deleteAudit(auditId);
            reloadAudits();
        } catch (err) {
            console.error("Delete audit error:", err);
        }
    };
    const [selectedLogs, setSelectedLogs] = useState<number[]>([]);

    const toggleLogSelection = (id: number) => {
        setSelectedLogs((prev) =>
            prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]
        );
        if (editAuditId) {
            const selectedLog = logs.find((log) => log.activityLogId === id);
            if (!selectedLog) return;

            setEditAuditValues((prev: any) => {
                const alreadyExists = (prev.activityLogs || []).some(
                    (log: any) => log.activityLogId === id
                );

                return {
                    ...prev,
                    activityLogs: alreadyExists
                        ? prev.activityLogs.filter((log: any) => log.activityLogId !== id)
                        : [...(prev.activityLogs || []), selectedLog],
                };
            });
        }
    };
    const [createAuditData, setCreateAuditData] = useState({
        auditOutput: "",
        auditStatus: AuditStatus.PENDING,
        auditType: AuditType.Finacial,
    });
    const handleCreateAudit = async () => {
        if (
            !createAuditData.auditOutput ||
            !createAuditData.auditStatus ||
            !createAuditData.auditType
        ) {
            setErrorMessage("Please fill all fields");
            setSuccessMessage(null);
            return;
        }

        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {

            await createAudit({
                ...createAuditData,
                activityLogIds: selectedLogs,
            });

            setDisabledwCreateAudit(false);
            setSelectedLogs([]);
            reloadAudits();
        } catch (err) {
            console.error("Create audit error:", err);
        }
    };
    const handleRemoveLog = (logIdToRemove: number) => {
        setEditAuditValues((prev: any) => ({
            ...prev,
            activityLogs: (prev.activityLogs || []).filter((log: any) => log.activityLogId !== logIdToRemove),
        }));
    };
    return (
        <div className="space-y-10">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-black dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white">
                <div className="p-4 flex gap-4 flex-wrap items-center">
                    <input
                        type="text"
                        placeholder="Search activity..."
                        className="p-2 border rounded bg-transparent dark:bg-transparent w-full md:w-96"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
                                <Calendar mode="single" selected={date} onSelect={idx === 0 ? setStartDate : setEndDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    ))}
                </div>

                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white dark:bg-black z-10 border-b border-gray-100 dark:border-white/[0.05] shadow-sm">
                                <TableRow>
                                    <TableCell className="px-5 py-3 font-medium" children={undefined}></TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Activity Name</TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Description</TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Country</TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Date</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {isLoading ? (
                                    <TableRow><td colSpan={4} className="text-center py-4">Loading logs...</td></TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow><td colSpan={4} className="text-center py-4">No activities found.</td></TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.activityLogId}>
                                            <TableCell className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLogs.includes(log.activityLogId)}
                                                    onChange={() => toggleLogSelection(log.activityLogId)}
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4 font-medium truncate max-w-[200px]">{log.activityLogName}</TableCell>
                                            <TableCell className="px-4 py-3 max-w-[250px] truncate">{log.activityLogDescription || "-"}</TableCell>
                                            <TableCell className="px-4 py-3"><Badge size="sm" color="info">{log.country || "-"}</Badge></TableCell>
                                            <TableCell className="px-4 py-3">{new Date(log.activityDate).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex justify-center py-4">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-black dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white">
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Audit Table</h2>
                </div>
                <div className="p-4 flex gap-4 flex-wrap items-center">
                    <input
                        type="text"
                        placeholder="Search Output"
                        className="p-2 border rounded bg-transparent dark:bg-transparent w-64"
                        value={outputFilter}
                        onChange={(e) => setOutputFilter(e.target.value)}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border rounded bg-white dark:bg-black"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="Paused">Paused</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="p-2 border rounded bg-white dark:bg-black"
                    >
                        <option value="">All Types</option>
                        <option value="Finacial">Finacial</option>
                        <option value="compliance">Compliance</option>
                        <option value="Risk">Risk</option>
                    </select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-2 p-2 px-3 border rounded-md bg-white dark:bg-black text-sm cursor-pointer shadow-sm w-[150px]">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className="truncate">
          {startDateAudit ? format(startDateAudit, "yyyy-MM-dd") : "Start Date"}
        </span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={startDateAudit} onSelect={setStartDateAudit} initialFocus />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-2 p-2 px-3 border rounded-md bg-white dark:bg-black text-sm cursor-pointer shadow-sm w-[150px]">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className="truncate">
          {endDateAudit ? format(endDateAudit, "yyyy-MM-dd") : "End Date"}
        </span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={endDateAudit} onSelect={setEndDateAudit} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <Button
                        onClick={() => setDisabledwCreateAudit(true)}
                        className="ml-auto flex items-center gap-2"
                        disabled={selectedLogs.length === 0}
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Audit
                    </Button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white dark:bg-black z-10 border-b border-gray-100 dark:border-white/[0.05] shadow-sm">
                                <TableRow>
                                    <TableCell className="px-5 py-3 font-medium">Audit Type</TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Status</TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Output</TableCell>
                                    <TableCell className="px-5 py-3 font-medium">Created</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-center">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {audits.length === 0 ? (
                                    <TableRow><td colSpan={5} className="text-center py-4">No audits found.</td></TableRow>
                                ) : (
                                    audits.map((audit: any) => (
                                        <React.Fragment key={audit.auditId}>
                                            <TableRow>
                                                <TableCell className="px-5 py-4">{audit.auditType}</TableCell>
                                                <TableCell className="px-4 py-3"><Badge size="sm">{audit.auditStatus}</Badge></TableCell>
                                                <TableCell className="px-4 py-3 max-w-[300px] truncate">{audit.auditOutput}</TableCell>
                                                <TableCell className="px-4 py-3">{new Date(audit.auditDate).toLocaleString()}</TableCell>
                                                <TableCell className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => toggleEdit(audit)} className="text-gray-500 hover:text-blue-600 transition" title="Edit">
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteAudit(audit.auditId)} className="text-gray-500 hover:text-red-600 transition" title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {editAuditId === audit.auditId && (
                                                <TableRow>
                                                    <td colSpan={5} className="px-5 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>Output</Label>
                                                                <Input
                                                                    value={editAuditValues.auditOutput || ""}
                                                                    onChange={(e) => handleEditChange("auditOutput", e.target.value)}
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Status</Label>
                                                                <select
                                                                    value={editAuditValues.auditStatus || ""}
                                                                    onChange={(e) => handleEditChange("auditStatus", e.target.value)}
                                                                    className="p-2 border rounded w-full bg-white dark:bg-black"
                                                                >
                                                                    <option value="PENDING">Pending</option>
                                                                    <option value="APPROVED">Approved</option>
                                                                    <option value="REJECTED">Rejected</option>
                                                                    <option value="Paused">Paused</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <Label>Type</Label>
                                                                <select
                                                                    value={editAuditValues.auditType || ""}
                                                                    onChange={(e) => handleEditChange("auditType", e.target.value)}
                                                                    className="p-2 border rounded w-full bg-white dark:bg-black"
                                                                >
                                                                    <option value="Finacial">Finacial</option>
                                                                    <option value="compliance">Compliance</option>
                                                                    <option value="Risk">Risk</option>
                                                                </select>
                                                            </div>

                                                            <div className="md:col-span-2">
                                                                <Label>Activity Logs Linked</Label>
                                                                <div className="space-y-2 max-h-[150px] overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
                                                                    {(editAuditValues.activityLogs || []).map((log: any) => (
                                                                        <div key={log.activityLogId} className="text-sm border-b pb-1 flex justify-between items-center">
                                                                            <div>
                                                                                <div><strong>Name:</strong> {log.activityLogName}</div>
                                                                                <div><strong>Date:</strong> {new Date(log.activityDate).toLocaleString()}</div>
                                                                            </div>
                                                                            <button
                                                                                className="text-red-500 hover:text-red-700"
                                                                                onClick={() => handleRemoveLog(log.activityLogId)}
                                                                                title="Remove Log"
                                                                            >
                                                                                ❌
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {(!editAuditValues.activityLogs || editAuditValues.activityLogs.length === 0) && (
                                                                        <div className="text-xs italic text-gray-400">No logs linked</div>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs mt-1 text-gray-500 italic">
                                                                    To add more logs, select them above from the main activity log table before saving.
                                                                </p>
                                                            </div>

                                                            <div className="md:col-span-2 flex justify-end">
                                                                <Button size="sm" onClick={confirmEdit} className="mt-4">
                                                                    <CheckCircle className="w-4 h-4 mr-2" /> Confirm Edit
                                                                </Button>
                                                            </div>
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
                    <Pagination currentPage={auditPage} totalPages={auditTotalPages} onPageChange={setAuditPage} />
                </div>
            </div>
            <Dialog open={disableCreateAudit} onOpenChange={setDisabledwCreateAudit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Audit</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {logs
                            .filter((log) => selectedLogs.includes(log.activityLogId))
                            .map((log) => (
                                <div key={log.activityLogId} className="text-sm border p-2 rounded">
                                    <div>
                                        <strong>Name:</strong> {log.activityLogName}
                                    </div>
                                    <div>
                                        <strong>Date:</strong> {new Date(log.activityDate).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="space-y-3 mt-4">
                        <Input
                            placeholder="Audit Output"
                            value={createAuditData.auditOutput}
                            onChange={(e) =>
                                setCreateAuditData({ ...createAuditData, auditOutput: e.target.value })
                            }
                        />

                        <select
                            value={createAuditData.auditStatus}
                            onChange={(e) =>
                                setCreateAuditData({
                                    ...createAuditData,
                                    auditStatus: e.target.value as AuditStatus,
                                })
                            }
                            className="p-2 border rounded bg-white dark:bg-black w-full"
                        >
                            <option value="">Select Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="Paused">Paused</option>
                        </select>

                        <select
                            value={createAuditData.auditType}
                            onChange={(e) =>
                                setCreateAuditData({
                                    ...createAuditData,
                                    auditType: e.target.value as AuditType,
                                })
                            }
                            className="p-2 border rounded bg-white dark:bg-black w-full"
                        >
                            <option value="">Select Type</option>
                            <option value="Finacial">Finacial</option>
                            <option value="compliance">Compliance</option>
                            <option value="Risk">Risk</option>
                        </select>

                        {successMessage && (
                            <div className="text-green-600 font-semibold mt-2">{successMessage}</div>
                        )}
                        {errorMessage && (
                            <div className="text-red-600 font-semibold mt-2">{errorMessage}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCreateAudit} disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
