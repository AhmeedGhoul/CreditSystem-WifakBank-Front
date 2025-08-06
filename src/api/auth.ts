import { LoginDto, LoginResponse} from "@/interface/auth";
import {CreateUserDto} from "@/interface/User";
import {NextResponse} from "next/server";



export async function loginUser(credentials: LoginDto): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
}
export async function logoutUser(): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
}
export async function RegisterUser(credentials: CreateUserDto): Promise<String> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "register failed");
    }

    const data = await response.json();

    return data;
}
export async function requestPasswordReset(email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/request-password-reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send reset email.");
    }

    return await res.json();
}

export async function resetPassword(payload: {
    password: string;
    token: string;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
    }

    return response.json();}