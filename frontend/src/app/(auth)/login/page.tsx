"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/dashboard");
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Server error, please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <ThemeToggle />

            <form
                onSubmit={handleSubmit}
                className="bg-card border border-border p-8 rounded-xl shadow-lg w-96"
            >
                {/* <h1 className="text-2xl font-bold mb-1 text-center text-foreground">
          Sprintly
        </h1> */}
                <div className="flex justify-center mb-2">
                    <Image src="/logo.png" alt="Sprintly" width={160} height={40} priority />
                </div>
                <p className="text-sm text-muted text-center mb-6">
                    Welcome back, login to continue
                </p>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 mb-6 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-center mt-4 text-muted">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="text-primary hover:underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
}