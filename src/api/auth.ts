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
