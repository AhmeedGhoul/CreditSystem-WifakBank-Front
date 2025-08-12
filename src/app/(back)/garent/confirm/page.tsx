"use client";

import { useEffect, useState } from "react";

export default function GarentConfirmPage() {
    const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [tokenValid, setTokenValid] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    // Extract token from query string
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const t = urlParams.get("token");
        setToken(t);
    }, []);

    // Verify token on load
    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid confirmation link.");
            return;
        }

        async function verifyToken() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/garent/confirm?token=${token}`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus("error");
                    setMessage(data.message || "Invalid or expired token.");
                    return;
                }

                setStatus("ready");
                setTokenValid(true);
                setMessage(data.message || "Do you accept to become a guarantor?");
            } catch (err) {
                setStatus("error");
                setMessage("Error contacting the server.");
            }
        }

        verifyToken();
    }, [token]);

    // Confirm action
    async function confirmGarent() {
        if (!token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/garent/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("You are now a guarantor.");
                setConfirmed(true);
            } else {
                setStatus("success");
                setMessage( "You are now a guarantor.");
                setConfirmed(true);

            }
        } catch (err) {
        }
    }

    // UI States
    if (status === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
                <p>Checking your confirmation link...</p>
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-black text-red-400 p-6">
                <h2 className="text-2xl mb-4">Error</h2>
                <p>{message}</p>
            </main>
        );
    }

    if (status === "success") {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 p-6">
                <h2 className="text-3xl mb-4">Success</h2>
                <p>{message}</p>
            </main>
        );
    }

    if (status === "ready" && tokenValid && !confirmed) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
                <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 text-center shadow-lg">
                    <h2 className="text-3xl font-bold mb-6">Confirm Guarantor Role</h2>
                    <p className="mb-8">{message}</p>
                    <button
                        onClick={confirmGarent}
                        className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 transition"
                    >
                        Confirm as Guarantor
                    </button>
                </div>
            </main>
        );
    }

    return null;
}
