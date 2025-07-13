"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "@/components/ui/button/Button";

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (role: string) => void;
    type: "promote" | "demote";
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onConfirm, type }) => {
    const [selectedRole, setSelectedRole] = useState("");
    const roles = ['Admin', 'Client', 'Auditor', 'Agent'];
    const handleSubmit = () => {
        if (selectedRole) {
            onConfirm(selectedRole);
            setSelectedRole("");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded bg-white dark:bg-zinc-800 p-6 shadow-lg">
                    <Dialog.Title className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                        {type === "promote" ? "Promote User" : "Demote User"}
                    </Dialog.Title>


                    <select
                        className="w-full p-2 border rounded mb-4 dark:bg-zinc-900 dark:text-white"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>


                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={!selectedRole}>
                            Confirm
                        </Button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default RoleModal;
