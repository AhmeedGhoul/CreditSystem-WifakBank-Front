"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface GarentPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function GarentPopup({ isOpen, onClose, onSuccess }: GarentPopupProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/garent/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                onSuccess();
                onClose();
            } else {
                toast.error(data.message || "Failed to send invitation");
            }
        } catch (err) {
            toast.error("Error contacting server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add a Guarantor">
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Please enter the email of your guarantor to send an invitation.
            </p>
            <input
                type="email"
                placeholder="Guarantor's email"
                className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSend} disabled={loading || !email}>
                    {loading ? "Sending..." : "Send Invitation"}
                </Button>
            </div>
        </Modal>
    );
}
