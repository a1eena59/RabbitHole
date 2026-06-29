import { BrowsingEvent, SessionPayload, RecordingStatus } from '../types/browsing';

let inMemoryEvents: BrowsingEvent[] = [];
let recordingStartTime: number | null = null;
let lastEventTimestamp: number | null = null;
let currentUrl: string | undefined = undefined;

// Keep tab tracking maps to trace context for tab closures
const tabUrlHistory = new Map<number, { url: string; title: string; domain: string }>();

export const Recorder = {
    start(): void {
        inMemoryEvents = [];
        tabUrlHistory.clear();
        recordingStartTime = Date.now();
        lastEventTimestamp = Date.now();
        currentUrl = undefined;
    },

    addEvent(event: Omit<BrowsingEvent, 'timeSpent'>): void {
        // 1. Calculate delta interval using the true event creation time
        if (inMemoryEvents.length > 0 && lastEventTimestamp !== null) {
            inMemoryEvents[inMemoryEvents.length - 1].timeSpent = event.timestamp - lastEventTimestamp;
        }

        // 2. Archive location records if it's a structural hit
        if (event.eventType !== 'tab_close' && event.url) {
            tabUrlHistory.set(event.tabId, { url: event.url, title: event.title, domain: event.domain });
            currentUrl = event.url;
        }

        // 3. Reconstruct context fallback for tab closures
        let finalizedEvent: BrowsingEvent = { ...event, timeSpent: 0 };
        if (event.eventType === 'tab_close') {
            const fallback = tabUrlHistory.get(event.tabId);
            if (fallback) {
                finalizedEvent.url = fallback.url;
                finalizedEvent.title = `Closed: ${fallback.title}`;
                finalizedEvent.domain = fallback.domain;
            }
        }

        inMemoryEvents.push(finalizedEvent);
        lastEventTimestamp = event.timestamp;
    },

    stop(): SessionPayload {
        const endTime = Date.now();
        const startTime = recordingStartTime || endTime;

        if (inMemoryEvents.length > 0 && lastEventTimestamp !== null) {
            inMemoryEvents[inMemoryEvents.length - 1].timeSpent = endTime - lastEventTimestamp;
        }

        const payload: SessionPayload = {
            startTime,
            endTime,
            duration: endTime - startTime,
            events: [...inMemoryEvents]
        };

        this.clear();
        return payload;
    },

    getStatus(): RecordingStatus {
        const uniqueTabs = new Set(inMemoryEvents.map(e => e.tabId));
        return {
            isRecording: recordingStartTime !== null,
            duration: recordingStartTime ? Date.now() - recordingStartTime : 0,
            eventCount: inMemoryEvents.length,
            uniqueTabsCount: uniqueTabs.size,
            currentUrl
        };
    },

    clear(): void {
        inMemoryEvents = [];
        tabUrlHistory.clear();
        recordingStartTime = null;
        lastEventTimestamp = null;
        currentUrl = undefined;
    }
};