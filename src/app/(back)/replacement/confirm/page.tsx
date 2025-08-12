"use client";

import { useEffect, useState } from "react";

export default function ReplacementConfirmPage() {
    const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [decisionMade, setDecisionMade] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const t = urlParams.get("token");
        setToken(t);
    }, []);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid confirmation link.");
            return;
        }

        async function verifyToken() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpool/confirm?token=${token}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    const data = await res.json();
                    setStatus("error");
                    setMessage(data.message || "Invalid or expired token.");
                    return;
                }

                const data = await res.json();
                setTokenValid(true);
                setStatus("ready");
                setMessage(data.message || "Please confirm or reject the replacement.");
            } catch (err) {
                setStatus("error");
                setMessage("Error contacting the server.");
            }
        }

        verifyToken();
    }, [token]);

    async function sendDecision(accept: boolean) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpool/replacement/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token, accept }),
            });

            const data = await res.json();
            setStatus("success");
            setMessage((accept ? "Replacement accepted!" : "Replacement rejected!"));

        } catch {

        }
        setDecisionMade(true);
    }

    if (status === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
                <p>Loading confirmation data...</p>
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-red-500">
                <h2 className="text-2xl mb-4">Error</h2>
                <p>{message}</p>
            </main>
        );
    }

    if (status === "success") {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-green-400">
                <h2 className="text-3xl mb-4">Success!</h2>
                <p>{message}</p>
            </main>
        );
    }

    if (status === "ready" && tokenValid && !decisionMade) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-white">
                <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 text-center shadow-lg">
                    <h2 className="text-3xl font-bold mb-6">Replacement Request Confirmation</h2>
                    <p className="mb-8">{message}</p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => sendDecision(true)}
                            className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 transition"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => sendDecision(false)}
                            className="px-6 py-3 bg-red-600 rounded hover:bg-red-700 transition"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return null;
}
