import axios from "axios";
import { supabase } from "../lib/supabase";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(async (config) => {
    const {
        data: {session},
    } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
})

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

export const createEvent = async (endpoint:string, event: EventCreateRequest): Promise<EventCreateResponse> => {
    const response = await api.post(endpoint, event);

    return response.data;
}

export default api;