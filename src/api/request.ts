import {CreateRequestDto} from "@/interface/request";

export async function createRequest(payload: CreateRequestDto, file?: File) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const formData = new FormData();

    formData.append("dto", JSON.stringify(payload));

    if (file) {
        formData.append("file", file);
    }

    for (const [key, value] of formData.entries()) {
        console.log("🧾 FormData entry:", key, value);
    }

    const response = await fetch(`${baseUrl}/request/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}
export async function fetchRequests(params: Record<string, string>) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        throw new Error("API URL is not defined in NEXT_PUBLIC_API_URL");
    }

    const url = new URL(`${baseUrl}/Request/search`);

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
        throw new Error(`Failed to fetch Requests: ${response.status} - ${errorText}`);
    }

    return await response.json();
}
export function getDocumentPreviewUrl(documentId: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");
    return `${baseUrl}/Request/documentPreview/${documentId}`;
}
export async function approveRequestByAgent(id: number) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${baseUrl}/request/appByAgent/${id}`, {
        method: "PUT",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Agent approval failed");
}

export async function approveRequestByAuditor(id: number) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${baseUrl}/request/appByAuditor/${id}`, {
        method: "PUT",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Auditor approval failed");
}