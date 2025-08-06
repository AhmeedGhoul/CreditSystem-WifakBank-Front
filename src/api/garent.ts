export async function checkIfUserHasGarent(): Promise<boolean> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/garent/has-garent`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to check garent status");
    }

    const data = await response.json();
    return data.hasGarent;
}
export async function fetchGarents(params: Record<string, string>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/garent/search`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== "") {
            url.searchParams.append(key, value);
        }
    });

    const response = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch garents");
    }

    const data = await response.json();

    console.log("Fetched garents:", data);
    return data;
}
