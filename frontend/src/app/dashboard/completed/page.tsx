"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { getTasks, updateTask, deleteTask } from "@/lib/api";

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate?: string;
    updatedAt?: string;
}

export default function CompletedPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const token = localStorage.getItem("token");
            if (!token) {
                if (!cancelled) setLoading(false);
                return;
            }

            try {
                const data = await getTasks(token);
                if (cancelled) return;

                if (Array.isArray(data)) {
                    setTasks(data.filter((t: Task) => t.status === "done"));
                } else {
                    setError(data.message || "Failed to load tasks");
                }
            } catch {
                if (!cancelled) setError("Server error while loading tasks");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleRestore = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const updated = await updateTask(token, id, { status: "todo" });
        if (updated._id) {
            setTasks(tasks.filter((t) => t._id !== id));
        }
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await deleteTask(token, id);
        setTasks(tasks.filter((t) => t._id !== id));
    };

    if (loading) {
        return <p className="text-muted">Loading completed tasks...</p>;
    }

    return (
        <div className="full-width">
            <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="text-green-500" size={24} />
                <h1 className="text-2xl font-bold">Completed Tasks</h1>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-left text-muted">
                            <th className="p-3 font-medium">Title</th>
                            <th className="p-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={2} className="p-6 text-center text-muted">
                                    No completed tasks yet.
                                </td>
                            </tr>
                        )}

                        {tasks.map((task) => (
                            <tr key={task._id} className="border-b border-border last:border-0">
                                <td className="p-3">
                                    <p className="font-medium line-through text-muted">
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-muted">{task.description}</p>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => handleRestore(task._id)}
                                            className="text-muted hover:text-primary transition"
                                            aria-label="Restore"
                                            title="Mark as not done"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="text-muted hover:text-red-500 transition"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}