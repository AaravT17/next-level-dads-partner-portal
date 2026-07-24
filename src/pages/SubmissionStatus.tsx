import { useState } from "react";

const STATUS_LABELS = [
    {key: "approved", title: "approved"},
    {key: "pending", title: "awaiting NLD review"},
    {key: "needs_info", title: "updates needed"},
    {key: "rejected", title: "rejected"},
];

export default function SubmissionStatus() {
    const [submissions] = useState([
        { id: 1, name: "Fall Festival meetup", status: "approved"},
        {id: 2, name: "Community resource guide", status: "pending"},
        {id: 3, name: "Robin Hood festival", status: "needs_info"},
        {id: 4, name: "Hood to Coast race meetup", status: "rejected"},
    ]);

    const [activeFilter, setActiveFilter] = useState("all");

    const filteredSubmissions =
        activeFilter === "all"
            ? submissions
            : submissions.filter((item) => item.status === activeFilter);

    return (
        <div>
            <p>Your Submissions</p>
            <h1>Submission Status</h1>

            <button onClick={() => setActiveFilter("all")}>All</button>
            <button onClick={() => setActiveFilter("approved")}>Approved</button>
            <button onClick={() => setActiveFilter("pending")}>Awaiting NLD Review</button>
            <button onClick={() => setActiveFilter("needs_info")}>Updates</button>
            <button onClick={() => setActiveFilter("rejected")}>Rejected</button>

            <ul>
                {filteredSubmissions.map((item) => (
                    <li key={item.id}>
                        {item.name} - {STATUS_LABELS.find((label) => label.key === item.status).title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
