import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router";

const STATUS_LABELS = [
    {key: "approved", title: "Approved", dotColor: "bg-green-500"},
    {key: "pending", title: "Awaiting NLD review", dotColor: "bg-neutral-500"},
    {key: "rejected", title: "Rejected", dotColor: "bg-red-500"},
];

const EMPTY_MESSAGES = {
    all: "Nothing here yet - submit an event or resource to get started.",
    approved: "None of your events or resources have been approved yet.",
    pending: "You have nothing awaiting review.",
    needs_info: "You have no submissions that need more details.",
    rejected: "You have no rejected submissions."
};

type Submission = {
    id: string;
    name: string;
    description: string | null;
    type: string;
    app_status: string;
    created_at: string;
    location: string | null;
    openMessage?: boolean;
};

export default function SubmissionStatus() {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
        
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", description: "", location: "" });
    const [isSaving, setIsSaving] = useState(false);

    async function loadSubmissions() {
        setIsLoading(true);
        setHasError(false); 
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organizations-events/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch");
            }
            const data = await response.json();
            setSubmissions(data);
            setIsLoading(false);
        } catch (err) {
            setHasError(true);
            setIsLoading(false);
        }
    }

    async function saveEdit() {
        if (!selectedSubmission) return;
        setIsSaving(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/events/${selectedSubmission.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(editForm),
        });
        if (!response.ok) {
            throw new Error("Failed to save");
        }
        setIsEditing(false);
        setSelectedSubmission(null);
        loadSubmissions();
    } catch (err) {
        alert("Failed to save changes. Please try again.");
    } finally {
        setIsSaving(false);
    }
}

    useEffect(() => {
        loadSubmissions();
    }, []);

    const approvedCount = submissions.filter((item) => item.app_status === "approved").length;
    const pendingCount = submissions.filter((item) => item.app_status === "pending" && item.openMessage !== true).length;
    const needsInfoCount = submissions.filter((item) => item.app_status === "pending" && item.openMessage === true).length;
    const rejectedCount = submissions.filter((item) => item.app_status === "rejected").length;
    const allCount = approvedCount + pendingCount + needsInfoCount + rejectedCount;

    const [activeFilter, setActiveFilter] = useState<"all" | "approved" | "pending" | "needs_info" | "rejected">("all");

    const FILTER_CARDS = [
    {key: "all", label: "All", count: allCount},
    {key: "approved", label: "Approved", count: approvedCount},
    {key: "pending", label: "Awaiting NLD Review", count: pendingCount},
    {key: "needs_info", label: "Update", count: needsInfoCount},
    {key: "rejected", label: "Rejected", count: rejectedCount}
    ] as const;  

    let filteredSubmissions;

    if (activeFilter === "all") {
    filteredSubmissions = submissions;
    } else if (activeFilter === "pending") {
    filteredSubmissions = submissions.filter(
        (item) => item.app_status === "pending" && item.openMessage !== true
    );
    } else if (activeFilter === "needs_info") {
    filteredSubmissions = submissions.filter(
        (item) => item.app_status === "pending" && item.openMessage === true
    );
    } else {
    filteredSubmissions = submissions.filter((item) => item.app_status === activeFilter);
    }

    if (isLoading) {
        return <p className="text-sm text-muted-foreground p-8">Loading your submissions...</p>;
    }

    if (hasError) {
        return (
            <div className="max-w-md mx-auto p-8 text-center">
                <p className="text-sm text-red-600 mb-3">Something went wrong loading your submissions.</p>
                <button onClick={() => loadSubmissions()} className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50">Refresh Submissions</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <p className="text-sm text-muted-foreground">Your Submissions</p>
            <h1 className="text-2xl font-heading font-semibold mb-4">Submission Status</h1>

            <div className="grid grid-cols-5 gap-4 mb-8">
                {FILTER_CARDS.map((card) => (
                    <div key={card.key} onClick={() => setActiveFilter(card.key)} className={`rounded-lg p-4 text-center cursor-pointer ${activeFilter === card.key ? "bg-black text-white" : "bg-gray-50 border"}`}>
                        <p className="text-sm mb-1">{card.label}</p>
                        <p className="text-2xl font-semibold">{card.count}</p>
                    </div>
                ))}
            </div>

            <div className="border rounded-xl divide-y">
                {filteredSubmissions.length === 0 
                    ? (<p className="text-sm px-4 py-3">{EMPTY_MESSAGES[activeFilter]}</p>
                    ) : (
                    filteredSubmissions.map((item) => {
                        const label = item.app_status === "pending" && item.openMessage === true
                        ? {title: "Update", dotColor: "bg-amber-500"}
                        : STATUS_LABELS.find((l) => l.key === item.app_status);

                        const formattedDate = new Date(item.created_at).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "numeric"
                        });

                        return (
                            <div key={item.id} onClick={() => {
                                setSelectedSubmission(item);
                                setEditForm({
                                    name: item.name,
                                    description: item.description || "",
                                    location: item.location || "",
                                });
                                setIsEditing(false);
                            }}
                            className="flex justify-between items-center px-4 py-3">
                                <div>
                                    <span className="text-sm">{item.name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] uppercase border rounded px-1.5 py-0.5 text-muted-foreground">{item.type}</span>
                                        <span className="text-xs text-muted-foreground">submitted {formattedDate}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5">
                                            {label && (
                                                <span className={`inline-block w-2 h-2 rounded-full ${label.dotColor}`}></span>
                                            )}
                                            <span className="text-sm text-muted-foreground">{label ? label.title : "status not found"}</span>
                                        </div>
                                        {item.app_status === "pending" && item.openMessage === true && (
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/messaging");
                                            }}
                                            className="text-xs border rounded-full px-3 py-1">Open and Respond</button>
                                        )}
                                    </div>
                                    <span className="text-muted-foreground text-lg ml-2">&gt;</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedSubmission(null)}>
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}>

                        {isEditing ? (
                            <>
                                <label className="text-xs text-muted-foreground">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
                                />
                                <label className="text-xs text-muted-foreground">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
                                    rows={3}
                                />

                                <label className="text-xs text-muted-foreground">Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
                                />

                                <div className="flex gap-2">
                                    <button
                                        onClick={saveEdit}
                                        disabled={isSaving}
                                        className="text-sm bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold mb-4">{selectedSubmission.name}</h2>
                                          {selectedSubmission.description && (<p className="text-sm text-muted-foreground mb-2">{selectedSubmission.description}</p>
                                )}
                                <p className="text-sm text-muted-foreground mb-2">Type: {selectedSubmission.type}</p>
                                <p className="text-sm text-muted-foreground mb-2">Location: {selectedSubmission.location || "Not provided"}</p>
                                <p className="text-sm text-muted-foreground mb-2">Status: {selectedSubmission.app_status}</p>
                                <p className="text-sm text-muted-foreground mb-4">Submitted: {new Date(selectedSubmission.created_at).toLocaleDateString("en-CA", {month: "short", day: "numeric"})}</p>

                                <div className="flex gap-2">
                                    {selectedSubmission.app_status !== "approved" && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedSubmission(null)}
                                        className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
