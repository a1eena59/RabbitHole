import { API } from '../constants/api';
import { SessionPayload, SessionResponse } from '../types/browsing';

export const ApiClient = {
    async sendSession(payload: SessionPayload): Promise<SessionResponse | null> {
        try {
            const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SESSION}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Fetch error code: ${response.status}`);
            return (await response.json()) as SessionResponse;
        } catch (e) {
            console.error("Upstream payload sync error:", e);
            return null;
        }
    },

    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.HEALTH}`);
            return response.ok;
        } catch {
            return false;
        }
    }
};