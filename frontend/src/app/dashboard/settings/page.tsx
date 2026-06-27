"use client";

import { useState } from "react";
import { updateProfile, changePassword } from "@/lib/api";

function getStoredUser(): { name: string; email: string } {
    if (typeof window === "undefined") return { name: "", email: "" };
    const user = localStorage.getItem("user");
    if (user) {
        try {
            const parsed = JSON.parse(user);
            return { name: parsed.name || "", email: parsed.email || "" };
        } catch {
            return { name: "", email: "" };
        }
    }
    return { name: "", email: "" };
}

export default function SettingsPage() {
    const [storedUser] = useState(getStoredUser);

    const [name, setName] = useState(storedUser.name);
    const [profileMsg, setProfileMsg] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg("");
        setProfileLoading(true);

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const data = await updateProfile(token, name);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                setProfileMsg("Profile updated successfully ✅");
            } else {
                setProfileMsg(data.message || "Something went wrong");
            }
        } catch {
            setProfileMsg("Server error, please try again");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg("");
        setPasswordLoading(true);

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const data = await changePassword(token, currentPassword, newPassword);
            if (data.message === "Password changed successfully") {
                setPasswordMsg("Password changed successfully.");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                setPasswordMsg(data.message || "Something went wrong");
            }
        } catch {
            setPasswordMsg("Server error, please try again");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="full-width space-y-6">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>

            {/* Profile Section */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Profile</h2>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-muted block mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-muted block mb-1">Email</label>
                            <input
                                type="email"
                                value={storedUser.email}
                                disabled
                                className="w-full p-2 border border-border rounded-lg bg-background text-muted cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {profileMsg && (
                        <p className="text-sm text-primary">{profileMsg}</p>
                    )}

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 text-sm"
                    >
                        {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Change Password</h2>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-muted block mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-muted block mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {passwordMsg && (
                        <p className="text-sm text-primary">{passwordMsg}</p>
                    )}

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 text-sm"
                    >
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
