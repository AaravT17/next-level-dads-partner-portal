import { useState } from "react";

export default function SubmissionStatus() {
    const [submissions] = useState([
        { id: 1, name: "Fall Festival meetup", status: "approved"},
        {id: 2, name: "Community resource guide", status: "pending"},
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
            <button onClick={() => setActiveFilter("pending")}>Awaiting review</button>
            <button onClick={() => setActiveFilter("needs_info")}>Updates</button>
            <button onClick={() => setActiveFilter("rejected")}>Rejected</button>

            <ul>
                {filteredSubmissions.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}