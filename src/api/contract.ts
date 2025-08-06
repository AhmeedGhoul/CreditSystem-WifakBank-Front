export async function createContract(payload: {
    contractDate: Date;
    creditPoolId: number,
    amount: number;
    frequency:number;
    period: number;
    rank:number
}, file: File) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const formData = new FormData();
    formData.append("dto", JSON.stringify(payload));
    formData.append("file", file);

    const response = await fetch(`${baseUrl}/contract/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit contract: ${response.status} - ${errorText}`);
    }

    return await response.json();
}
export async function fetchUserContracts(userId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contract/user/${userId}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user contracts");
    }

    return response.json();
}
export async function fetchTakenRanks(creditPoolId: number): Promise<number[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const response = await fetch(`${baseUrl}/contract/ranks/${creditPoolId}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch taken ranks");
    }

    return await response.json();
}
