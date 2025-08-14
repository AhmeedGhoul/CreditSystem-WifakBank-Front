"use client";

import React, { useState } from "react";
import { LogOut, Mail } from "lucide-react";

type Props = {
    poolIsFull: boolean;
    onLeave: () => Promise<void>;
    onSendReplacement: (email: string) => Promise<void>;
};

export default function LeavePoolButton({ poolIsFull, onLeave, onSendReplacement }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [replacementEmail, setReplacementEmail] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showConfirmLeave, setShowConfirmLeave] = useState(false);
    const [leavingLoading, setLeavingLoading] = useState(false);
    const [leaveError, setLeaveError] = useState<string | null>(null);
    const [leaveSuccess, setLeaveSuccess] = useState<string | null>(null);

    const handleLeaveClick = () => {
        if (poolIsFull) {
            setShowModal(true);
        } else {
            setShowConfirmLeave(true);
        }
    };

    const confirmLeave = async () => {
        setLeaveError(null);
        setLeaveSuccess(null);
        setLeavingLoading(true);

        try {
            await onLeave();
            setLeaveSuccess("✅ You have left the credit pool successfully.");
            setTimeout(() => {
                setShowConfirmLeave(false);
                setLeavingLoading(false);
            }, 1500);
        } catch (err: any) {
            setLeaveError(err.message || "Failed to leave credit pool.");
            setLeavingLoading(false);
        }
    };

    const handleSubmitReplacement = async () => {
        if (!replacementEmail.trim()) {
            setError("Please enter a replacement email.");
            return;
        }
        setError(null);
        setWaiting(true);
        try {
            await onSendReplacement(replacementEmail.trim());
        } catch (err: any) {
            setError(err.message || "Failed to send replacement request.");
            setWaiting(false);
            return;
        }
    };

    return (
        <>
            <button
                onClick={handleLeaveClick}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
                type="button"
            >
                <LogOut size={16} />
                Leave Pool
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-lg relative">
                        {waiting ? (
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-4">Waiting for replacement acceptance...</p>
                                <p>Please wait until your replacement is approved.</p>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setWaiting(false);
                                        setReplacementEmail("");
                                        setError(null);
                                    }}
                                    className="mt-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold mb-4">Find a replacement</h3>
                                <p className="mb-4">
                                    You cannot leave a full/started credit pool unless you find a replacement.
                                    Please enter the email of the person who will replace you.
                                </p>
                                <div className="flex items-center gap-2 mb-4">
                                    <Mail size={20} className="text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Replacement email"
                                        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={replacementEmail}
                                        onChange={(e) => setReplacementEmail(e.target.value)}
                                        disabled={waiting}
                                    />
                                </div>
                                {error && <p className="text-red-600 mb-2">{error}</p>}
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setError(null);
                                            setReplacementEmail("");
                                        }}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                        disabled={waiting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReplacement}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                        disabled={waiting}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showConfirmLeave && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-lg relative text-center">
                        <h3 className="text-xl font-semibold mb-4">Confirm Leave</h3>
                        <p className="mb-6">Are you sure you want to leave this credit pool?</p>

                        {leaveError && <p className="text-red-600 mb-4">{leaveError}</p>}
                        {leaveSuccess && <p className="text-green-600 mb-4">{leaveSuccess}</p>}

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirmLeave(false)}
                                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                disabled={leavingLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLeave}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                                disabled={leavingLoading}
                            >
                                {leavingLoading ? "Leaving..." : "Leave Pool"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
