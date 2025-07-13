export async function fetchCreditPools(params: Record<string, string>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/creditpool/search`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== "") url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch credit pools");
    }

    return response.json();
}
// @/api/creditPool.ts

export async function createCreditPool(payload: {
    Frequency: number;
    Period: number;
    FinalValue: number;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpool/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Create failed:", errorData);
        throw new Error("Failed to create credit pool");
    }

    return response.json();
}
