export async function fetchLogs(params: Record<string, string>) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        throw new Error("API URL is not defined in NEXT_PUBLIC_API_URL");
    }

    const url = new URL(`${baseUrl}/activitylog/search`);

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
        throw new Error(`Failed to fetch activities: ${response.status} - ${errorText}`);
    }

    return await response.json();
}
