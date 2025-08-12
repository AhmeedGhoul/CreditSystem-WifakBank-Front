import {User} from "@/interface/User";
import {parseJwt} from "@/lib/jwt";

export async function fetchUsers(params: Record<string, string>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user/users/search`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== "") {
            url.searchParams.append(key, value);
        }
    });

    const response = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    console.log("Fetched users:", data);
    return data;
}

export async function promoteUser(userId: number, roleName: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/promote/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roleName }),
    });
}

export async function demoteUser(userId: number, roleName: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/demote/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roleName }),
    });
}
export async function deleteUser(userId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}
export async function modifyUser(userId: number, userData: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/modify/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return response.json();
}
export async function checkUserAccess(): Promise<boolean> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${baseUrl}/user/has-access`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const data = await response.json();
    return data.hasAccess;
}


export async function fetchCurrentUser(): Promise<User | null> {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

    if (!token) return null;

    const decoded = parseJwt(token);
    const uid = decoded?.sub;

    if (!uid) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/current-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });

    if (!res.ok) {
        console.error("Failed to fetch current user");
        return null;
    }

    const data = await res.json();
    return data.hasAccess || null;
}
export interface UserStats {
    totalUsers: number;
    activeUsersLastMonth: number;
    totalContracts: number;
    totalContractAmount: number;
}

export async function fetchUserStats(): Promise<UserStats> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/stats`); // Adjust path if needed
    if (!res.ok) {
        throw new Error('Failed to fetch user stats');
    }
    return res.json();
}
export async function fetchMonthlyPayments() {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

    if (!token) return null;

    const decoded = parseJwt(token);
    const uid = decoded?.sub;

    if (!uid) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/monthly-payments`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });
    if (!res.ok) throw new Error('Failed to fetch monthly payments');
    return res.json() as Promise<number[]>;
}

