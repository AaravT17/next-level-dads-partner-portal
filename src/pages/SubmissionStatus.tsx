import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

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
    type: string;
    app_status: string;
    created_at: string;
    openMessage?: boolean;
};

export default function SubmissionStatus() {
    const { accessToken } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

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
                            <div key={item.id} className="flex justify-between items-center px-4 py-3">
                                <div>
                                    <span className="text-sm">{item.name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] uppercase border rounded px-1.5 py-0.5 text-muted-foreground">{item.type}</span>
                                        <span className="text-xs text-muted-foreground">submitted {formattedDate}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1.5">
                                        {label && (
                                            <span className={`inline-block w-2 h-2 rounded-full ${label.dotColor}`}></span>
                                        )}
                                        <span className="text-sm text-muted-foreground">{label ? label.title : "status not found"}</span>
                                    </div>
                                    {item.app_status === "pending" && item.openMessage === true && (
                                        <button onClick={() => console.log("TODO: open messaging thread for submission", item.id)} className="text-xs border rounded-full px-3 py-1">Open and Respond</button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                </div>
            </div>
        );
}
