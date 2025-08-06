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

    const handleLeaveClick = () => {
        if (poolIsFull) {
            setShowModal(true);
        } else {
            if (window.confirm("Are you sure you want to leave this credit pool?")) {
                onLeave().catch((err) => alert(err.message || "Failed to leave credit pool"));
            }
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
            // show waiting message
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

            {/* Modal */}
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
                                        onClick={() => setShowModal(false)}
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
        </>
    );
}
