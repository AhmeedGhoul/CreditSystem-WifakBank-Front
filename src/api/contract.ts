export async function createContract(payload: {
    contractDate: Date;
    creditPoolId: number,
    amount: number;
    period: number;
}, file: File) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
    const formData = new FormData();
    formData.append("dto", JSON.stringify(payload)); // dto now includes creditPoolId
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

    return response.json(); // [{ contractId, creditPoolId, userId }]
}