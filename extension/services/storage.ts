import { STORAGE_KEYS } from '../constants/storage';

export const StorageWrapper = {
    async saveLastSessionId(id: string): Promise<void> {
        await chrome.storage.local.set({ [STORAGE_KEYS.LAST_SESSION_ID]: id });
    },

    async getLastSessionId(): Promise<string | null> {
        const data = await chrome.storage.local.get(STORAGE_KEYS.LAST_SESSION_ID);
        return data[STORAGE_KEYS.LAST_SESSION_ID] || null;
    },

    async clearSession(): Promise<void> {
        await chrome.storage.local.remove(STORAGE_KEYS.LAST_SESSION_ID);
    }
};