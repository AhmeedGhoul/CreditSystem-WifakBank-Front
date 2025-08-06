export async function fetchNotifications(): Promise<any[]> {
    const res = await fetch("http://localhost:3000/notification/me", {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
}