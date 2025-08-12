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
export async function fetchMyCreditPools() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpool/my-pools`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user's credit pools");
    }

    return res.json();
}
export async function leaveCreditPool(creditPoolId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creditpool/leave/${creditPoolId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to leave credit pool");
    }

    return res.json();
}
export async function sendReplacementRequest(
    creditPoolId: number,
    replacementEmail: string
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/creditpool/replacement-request`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ creditPoolId, replacementEmail }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send replacement request");
    }

    return response.json();
}

export async function fetchRecommendedCreditPools() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ml/recommend`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch recommended credit pools");
    }

    return res.json();
}
