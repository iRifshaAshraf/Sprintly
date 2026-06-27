"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ListTodo,
    CheckCircle2,
    Settings,
    LogOut,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
    { name: "Completed", href: "/dashboard/completed", icon: CheckCircle2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string {
    if (typeof window === "undefined") return "";
    const user = localStorage.getItem("user");
    if (!user) return "";
    try {
        return JSON.parse(user).name || "User";
    } catch {
        return "User";
    }
}

function getServerSnapshot(): string {
    return "";
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const userName = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const initial = userName ? userName.charAt(0).toUpperCase() : "";

    return (
        <aside className="h-screen sticky top-0 flex flex-col w-60 bg-card border-r border-border">
            {/* Logo */}
            <div className="flex items-center p-4 border-b border-border">
                <Image src="/logo.png" alt="Sprintly" width={120} height={30} priority />
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive
                                ? "bg-primary text-white"
                                : "text-foreground hover:bg-background"
                                }`}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Active account */}
            <div className="p-3 border-t border-border">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shrink-0">
                        <span suppressHydrationWarning>{initial}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" suppressHydrationWarning>
                            {userName}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-muted hover:bg-background hover:text-red-500 transition w-full"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}