export const API = {
    BASE_URL: import.meta.env.WXT_API_URL || "http://localhost:8000",
    ENDPOINTS: {
        SESSION: "/api/session",
        HEALTH: "/api/health",
    },
} as const;