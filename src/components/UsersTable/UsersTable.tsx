"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {
  fetchUsers,
  promoteUser,
  demoteUser,
  deleteUser,
  modifyUser,
} from "@/api/user";
import {
  Trash2,
  Pencil,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Pagination from "@/components/UsersTable/Pagination";

const roles = ["Admin", "Client", "Auditor", "Agent"];

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockedFilter, setBlockedFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [actionType, setActionType] = useState<"promote" | "demote" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const reloadUsers = () => {
    const params: Record<string, any> = {
      page: currentPage.toString(),
      size: "10",
    };

    if (search.trim()) {
      params.firstName = search;
      params.lastName = search;
      params.email = search;
    }
    if (statusFilter === "true") params.isEnabled = "true";
    if (statusFilter === "false") params.isEnabled = "false";
    if (blockedFilter === "true") params.isAccountBlocked = "true";
    if (blockedFilter === "false") params.isAccountBlocked = "false";

    fetchUsers(params)
        .then((res) => {
          setUsers(res.data);
          setTotalPages(res.totalPages || 1);
        })
        .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    reloadUsers();
  }, [search, statusFilter, blockedFilter, currentPage]);

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole || !actionType) return;
    try {
      if (actionType === "promote") await promoteUser(selectedUser, selectedRole);
      else await demoteUser(selectedUser, selectedRole);
      setDialogOpen(false);
      setSelectedUser(null);
      setSelectedRole("");
      setActionType(null);
      reloadUsers();
    } catch (err) {
      console.error("Role update error:", err);
    }
  };

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
    try {
      await deleteUser(userId);
      reloadUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleEdit = (user: any) => {
    setEditingUserId((prev) => (prev === user.userId ? null : user.userId));
    setEditValues(user);
  };

  const handleEditChange = (key: string, value: any) => {
    const numericFields = ["age", "phoneNumber"];
    const parsedValue = numericFields.includes(key) ? Number(value) : value;
    setEditValues((prev: any) => ({ ...prev, [key]: parsedValue }));
  };

  const confirmEdit = async () => {
    if (!editingUserId) return;
    try {
      await modifyUser(editingUserId, editValues);
      setEditingUserId(null);
      setEditValues({});
      reloadUsers();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-black dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white">
        <div className="p-4 flex gap-4 flex-wrap items-center">
          <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 border rounded bg-transparent dark:bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
          <select
              className="p-2 border rounded bg-transparent dark:bg-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
          <select
              className="p-2 border rounded bg-transparent dark:bg-transparent"
              value={blockedFilter}
              onChange={(e) => setBlockedFilter(e.target.value)}
          >
            <option value="">All Blocked</option>
            <option value="true">Blocked</option>
            <option value="false">Not Blocked</option>
          </select>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-black z-10 border-b border-gray-100 dark:border-white/[0.05] shadow-sm">
                <TableRow>
                  <TableCell className="px-5 py-3 font-medium">User</TableCell>
                  <TableCell className="px-5 py-3 font-medium">Role</TableCell>
                  <TableCell className="px-5 py-3 font-medium">Status</TableCell>
                  <TableCell className="px-5 py-3 font-medium">Blocked</TableCell>
                  <TableCell className="px-5 py-3 font-medium text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users.length === 0 ? (
                    <TableRow>
                      <td colSpan={5} className="text-center py-4">
                        No users found.
                      </td>
                    </TableRow>
                ) : (
                    users.map((user: any) => (
                        <React.Fragment key={user.userId}>
                          <TableRow>
                            <TableCell className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold">
                                  {user.firstName?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 space-x-1">
                              {user.roles && user.roles.length > 0 ? (
                                  user.roles.map((role: { id: number; name: string }, index: number) => (
                                      <Badge
                                          key={role.id || index}
                                          size="sm"
                                          color={
                                            role.name === "Admin"
                                                ? "warning"
                                                : role.name === "Auditor"
                                                    ? "info"
                                                    : role.name === "Agent"
                                                        ? "success"
                                                        : "error"
                                          }
                                      >
                                        {role.name}
                                      </Badge>
                                  ))


                              ) : (
                                  <Badge size="sm" color="info">User</Badge>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge size="sm" color={user.isEnabled ? "success" : "error"}>
                                {user.isEnabled ? "Enabled" : "Disabled"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge size="sm" color={user.isAccountBlocked ? "error" : "success"}>
                                {user.isAccountBlocked ? "Blocked" : "Not Blocked"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => toggleEdit(user)}
                                    className="text-gray-500 hover:text-blue-600 transition"
                                    title="Modify"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                      setSelectedUser(user.userId);
                                      setActionType("promote");
                                      setDialogOpen(true);
                                    }}
                                    className="text-gray-500 hover:text-green-600 transition"
                                    title="Promote"
                                >
                                  <ArrowUpCircle size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                      setSelectedUser(user.userId);
                                      setActionType("demote");
                                      setDialogOpen(true);
                                    }}
                                    className="text-gray-500 hover:text-yellow-500 transition"
                                    title="Demote"
                                >
                                  <ArrowDownCircle size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.userId)}
                                    className="text-gray-500 hover:text-red-600 transition"
                                    title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {editingUserId === user.userId && (
                              <TableRow>
                                <td colSpan={5} className="px-5 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>First Name</Label>
                                      <Input
                                          value={editValues.firstName || ""}
                                          onChange={(e) => handleEditChange("firstName", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label>Last Name</Label>
                                      <Input
                                          value={editValues.lastName || ""}
                                          onChange={(e) => handleEditChange("lastName", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <Input
                                          value={editValues.email || ""}
                                          onChange={(e) => handleEditChange("email", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label>Age</Label>
                                      <Input
                                          value={editValues.age || ""}
                                          onChange={(e) => handleEditChange("age", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label>Phone Number</Label>
                                      <Input
                                          value={editValues.phoneNumber || ""}
                                          onChange={(e) => handleEditChange("phoneNumber", e.target.value)}
                                      />
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
          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-white dark:bg-black text-black dark:text-white">
            <DialogHeader>
              <DialogTitle>{actionType === "promote" ? "Promote User" : "Demote User"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <select
                  className="p-2 border rounded bg-transparent dark:bg-transparent"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                ))}
              </select>
              <DialogFooter>
                <Button disabled={!selectedRole} onClick={handleRoleUpdate}>
                  Confirm
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}
