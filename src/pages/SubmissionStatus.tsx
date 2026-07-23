import { useState } from "react";

export default function SubmissionStatus() {
    const [submissions] = useState([
        { id: 1, name: "Fall Festival meetup", status: "approved"},
        {id: 2, name: "Community resource guide", status: "awaiting_review"},
    ]);

    return (
        <div>
            <p>Your Submissions</p>
            <h1>Submission Status</h1>

            <ul>
                {submissions.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}