"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchNotifications } from "@/api/notification";

const NotificationContext = createContext<any[]>([]);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const hasToken = document.cookie.includes("access_token");
        setIsAuthenticated(hasToken);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications()
                .then(setNotifications)
                .catch(console.error);
        }
    }, [isAuthenticated]);

    return (
        <NotificationContext.Provider value={notifications}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
