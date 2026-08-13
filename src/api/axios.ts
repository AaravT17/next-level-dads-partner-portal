import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
});

export interface EventCreateRequest {
    name: string;
    description: string | null;
    type: "local" | "virtual";
    starts_at: string | null;
    ends_at: string | null;
    location: string;
    latitude: number | "" | null;
    longitude: number | "" | null;
    contact_email: string | null;
    contact_phone: string | null;
    price_cad: number;
}

export interface EventCreateResponse {
    id: string;
}

export const createEvent = async (event: EventCreateRequest, accessToken: string | null): Promise<EventCreateResponse | null> => {
    if (!accessToken) {
        console.log("Cannot create event, access token required.")
        return null;
    }

    const response = await api.post(
        '/events/event-application', 
        event,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
    return response.data;
}

export default api;