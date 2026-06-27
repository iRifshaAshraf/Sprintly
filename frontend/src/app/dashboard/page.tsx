"use client";

import { useState } from "react";

function getUserName(): string {
    if (typeof window === "undefined") return "";
    const user = localStorage.getItem("user");
    if (user) {
        try {
            return JSON.parse(user).name || "there";
        } catch {
            return "there";
        }
    }
    return "there";
}

export default function DashboardHomePage() {
    const [userName] = useState<string>(getUserName);

    return (
        <div className="full-width">
            <div className="bg-card border border-border rounded-xl p-8">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back, <span suppressHydrationWarning>{userName}</span> 👋
                </h1>
                <p className="text-muted">
                    Here&apos;s a quick look at your workspace. Use the sidebar to
                    manage your tasks.
                </p>
            </div>
        </div>
    );
}