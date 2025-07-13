"use client";

import React from "react";
import { cn } from "@/lib/utils"; // You can replace with clsx or normal join if needed

export type BadgeVariant =
    | "default"
    | "primary"
    | "warning"
    | "error"
    | "info"
    | "success"
    | "destructive";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: "sm" | "md";
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = "default", size = "md", children, className, ...props }) => {
    const variantClass = {
        default: "bg-gray-200 text-gray-800",
        primary: "bg-blue-500 text-white",
        warning: "bg-yellow-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-cyan-500 text-white",
        success: "bg-green-500 text-white",
        destructive: "bg-red-700 text-white",
    }[variant];

    const sizeClass = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
    }[size];

    return (
        <span
            {...props}
            className={cn(
                "inline-flex items-center rounded-full font-medium",
                variantClass,
                sizeClass,
                className
            )}
        >
      {children}
    </span>
    );
};

export default Badge;
