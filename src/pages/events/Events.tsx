import { Link } from "react-router"

function Events() {
    
    return (
        <div className="page-container">
            <div className="content-container">
                <h2 className="content-subheader">Your events</h2>
                <div className="flex justify-between items-end">
                    <h1 className="content-header">My Events</h1>   

                    <div className="flex">
                        <Link to="/event-application">
                            <button className="btn text-sm flex gap-2">
                                <span>+</span>
                                <span>Submit event</span>
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Events