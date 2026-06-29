export type EventType =
    | "tab_open"
    | "tab_switch"
    | "page_load"
    | "tab_close"
    | "back_forward";

export interface BrowsingEvent {
    id: string;

    url: string;

    title: string;

    domain: string;

    timestamp: number;

    timeSpent: number;

    tabId: number;

    eventType: EventType;

    referrer?: string;
}

export interface RecordingStatus {
    isRecording: boolean;

    duration: number;

    eventCount: number;

    uniqueTabsCount: number;

    currentUrl?: string;
}

export interface SessionPayload {
    startTime: number;

    endTime: number;

    duration: number;

    events: BrowsingEvent[];
}

export interface SessionResponse {
    sessionId: string;
}

export type ExtensionMessage =
    | { type: "START_RECORDING" }
    | { type: "STOP_RECORDING" }
    | { type: "GET_STATUS" }
    | { type: "CLEAR_SESSION" };