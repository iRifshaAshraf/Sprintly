"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api";

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate?: string;
}

const statusStyles: Record<Task["status"], string> = {
    todo: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    done: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const statusLabels: Record<Task["status"], string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

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
                    setTasks(data.filter((t: Task) => t.status !== "done"));
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !title.trim()) return;

        const newTask = await createTask(token, { title, description });
        if (newTask._id) {
            setTasks([newTask, ...tasks]);
            setTitle("");
            setDescription("");
            setShowForm(false);
        }
    };

    const handleStatusChange = async (id: string, status: Task["status"]) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const updated = await updateTask(token, id, { status });
        if (updated._id) {
            if (status === "done") {
                setTasks(tasks.filter((t) => t._id !== id));
            } else {
                setTasks(tasks.map((t) => (t._id === id ? updated : t)));
            }
        }
    };

    const startEdit = (task: Task) => {
        setEditingId(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
    };

    const saveEdit = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token || !editTitle.trim()) return;

        const updated = await updateTask(token, id, {
            title: editTitle,
            description: editDescription,
        });
        if (updated._id) {
            setTasks(tasks.map((t) => (t._id === id ? updated : t)));
            cancelEdit();
        }
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await deleteTask(token, id);
        setTasks(tasks.filter((t) => t._id !== id));
    };

    if (loading) {
        return <p className="text-muted">Loading tasks...</p>;
    }

    return (
        <div className="full-width">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? "Cancel" : "Add Task"}
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Inline Add Form */}
            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className="bg-card border border-border p-4 rounded-xl mb-6 space-y-3"
                >
                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition text-sm"
                    >
                        Save Task
                    </button>
                </form>
            )}

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-left text-muted">
                            <th className="p-3 font-medium">Title</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-6 text-center text-muted">
                                    No active tasks. Click &quot;Add Task&quot; to create one.
                                </td>
                            </tr>
                        )}

                        {tasks.map((task) => (
                            <tr key={task._id} className="border-b border-border last:border-0">
                                {editingId === task._id ? (
                                    <>
                                        <td className="p-3" colSpan={2}>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full p-1.5 mb-1 border border-border rounded bg-background text-foreground text-sm"
                                                autoFocus
                                            />
                                            <input
                                                type="text"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder="Description"
                                                className="w-full p-1.5 border border-border rounded bg-background text-foreground text-sm"
                                            />
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => saveEdit(task._id)}
                                                    className="text-primary text-xs font-medium hover:underline"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="text-muted text-xs hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3">
                                            <p className="font-medium">{task.title}</p>
                                            {task.description && (
                                                <p className="text-xs text-muted">{task.description}</p>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={task.status}
                                                onChange={(e) =>
                                                    handleStatusChange(task._id, e.target.value as Task["status"])
                                                }
                                                className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${statusStyles[task.status]}`}
                                            >
                                                <option value="todo">{statusLabels.todo}</option>
                                                <option value="in-progress">{statusLabels["in-progress"]}</option>
                                                <option value="done">{statusLabels.done}</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => startEdit(task)}
                                                    className="text-muted hover:text-primary transition"
                                                    aria-label="Edit"
                                                >
                                                    <Pencil size={16} />
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
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}