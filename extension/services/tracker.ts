import { Recorder } from './recorder';
import { isInternalUrl, extractDomain } from '../utils/filters';
import { EventType } from '../types/browsing';

export const Tracker = {
    init(): void {
        // 1. View shifts
        chrome.tabs.onActivated.addListener((activeInfo) => {
            const now = Date.now();
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                if (chrome.runtime.lastError || !tab?.url || isInternalUrl(tab.url)) return;
                this.commit('tab_switch', tab.url, tab.title, activeInfo.tabId, now);
            });
        });

        // 2. Navigation streams
        chrome.webNavigation.onCommitted.addListener((details) => {
            if (details.frameId !== 0) return;
            const now = Date.now();

            let type: EventType = 'page_load';
            if (details.transitionQualifiers.includes('forward_back')) {
                type = 'back_forward';
            }

            chrome.tabs.get(details.tabId, (tab) => {
                if (chrome.runtime.lastError || !tab?.url || isInternalUrl(tab.url)) return;
                this.commit(type, details.url, tab.title, details.tabId, now);
            });
        });

        // 3. Context instantiations
        chrome.tabs.onCreated.addListener((tab) => {
            const now = Date.now();
            if (!tab.id || !tab.url || isInternalUrl(tab.url)) return;
            this.commit('tab_open', tab.url, tab.title, tab.id, now);
        });

        // 4. Closures
        chrome.tabs.onRemoved.addListener((tabId) => {
            Recorder.addEvent({
                id: crypto.randomUUID(),
                url: '',
                title: '',
                domain: '',
                timestamp: Date.now(),
                tabId,
                eventType: 'tab_close'
            });
        });
    },

    commit(eventType: EventType, url: string, title: string | undefined, tabId: number, timestamp: number): void {
        Recorder.addEvent({
            id: crypto.randomUUID(),
            url,
            title: title || url,
            domain: extractDomain(url),
            timestamp,
            tabId,
            eventType
        });
    }
};