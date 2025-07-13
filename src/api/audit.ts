import {CreateAuditDto} from "@/interface/audit";

export async function fetchAudit(params: Record<string, string>) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        throw new Error("API URL is not defined in NEXT_PUBLIC_API_URL");
    }

    const url = new URL(`${baseUrl}/Audit/search`);

    Object.entries(params).forEach(([key, value]) => {
        if (value?.trim()) {
            url.searchParams.append(key, value);
        }
    });

    const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch Audit: ${response.status} - ${errorText}`);
    }

    return await response.json();
}
export async function deleteAudit(auditId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Audit/delete/${auditId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete Audit");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}
export async function modifyAudit(auditId: number, auditData: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Audit/modify/${auditId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(auditData),
    });

    if (!response.ok) {
        throw new Error("Failed to update audit");
    }

    return response.json();
}
export async function createAudit(payload: CreateAuditDto) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${baseUrl}/audit/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}
