import { useEffect } from "react";
import { Link } from "react-router"
import { useLocation } from "react-router"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

function Events() {
    const location = useLocation();
    const { eventId } = location.state || {};

    useEffect(() => {
        if(eventId) {
            toast.success(`Event Application Submitted! Event ID: ${eventId}`, 
                {
                    position: 'top-right'
                }
            )
        }
    }, [eventId]);
    
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
            <ToastContainer />
        </div>
    )
}

export default Events