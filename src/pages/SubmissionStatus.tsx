import { useState, useEffect } from "react";

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

export default function SubmissionStatus() {
    const [submissions] = useState([
        {id: 1, name: "Fall Festival meetup", status: "approved", type: "event", submittedDate: "Jul 26", openMessage: false},
        {id: 2, name: "Community resource guide", status: "pending", type: "resource", submittedDate: "Oct 02", openMessage: false},
        {id: 3, name: "Robin Hood festival", status: "pending", type: "event", submittedDate: "May 18", openMessage: true},
        {id: 4, name: "Hood to Coast race guide", status: "rejected", type: "resource", submittedDate: "Feb 09", openMessage: false},
    ]);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        async function loadSubmissions() {
            setIsLoading(true);
            setHasError(false);
            try {
                //endpoint
                setIsLoading(false);
            } catch (err) {
                setHasError(true);
                setIsLoading(false);
            }
        }

        loadSubmissions();
    }, []);

    const approvedCount = submissions.filter((item) => item.status === "approved").length;
    const pendingCount = submissions.filter((item) => item.status === "pending" && item.openMessage === false).length;
    const needsInfoCount = submissions.filter((item) => item.status === "pending" && item.openMessage === true).length;
    const rejectedCount = submissions.filter((item) => item.status === "rejected").length;
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
        (item) => item.status === "pending" && item.openMessage === false
    );
    } else if (activeFilter === "needs_info") {
    filteredSubmissions = submissions.filter(
        (item) => item.status === "pending" && item.openMessage === true
    );
    } else {
    filteredSubmissions = submissions.filter((item) => item.status === activeFilter);
    }

    if (isLoading) {
        return <p className="text-sm text-muted-foreground p-8">Loading your submissions...</p>;
    }

    if (hasError) {
        return <p className="text-sm text-red-600 p-8">Something went wrong loading your submissions.</p>;
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
                        const label = item.status === "pending" && item.openMessage === true
                        ? {title: "Update", dotColor: "bg-amber-500"}
                        : STATUS_LABELS.find((l) => l.key === item.status);

                        return (
                            <div key={item.id} className="flex justify-between items-center px-4 py-3">
                                <div>
                                    <span className="text-sm">{item.name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] uppercase border rounded px-1.5 py-0.5 text-muted-foreground">{item.type}</span>
                                        <span className="text-xs text-muted-foreground">submitted {item.submittedDate}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm text-muted-foreground">{label ? label.title : "status not found"}</span>
                                    {item.status === "pending" && item.openMessage === true && (
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
