// extension/hooks/useRecorder.ts
import { useState, useEffect } from 'react';
import { RecordingStatus } from '../types/browsing';
import { MESSAGE_TYPES } from '../constants/messages';

export function useRecorder() {
    const [status, setStatus] = useState<RecordingStatus>({
        isRecording: false,
        duration: 0,
        eventCount: 0,
        uniqueTabsCount: 0,
    });

    const updateStatus = () => {
        chrome.runtime.sendMessage({ type: MESSAGE_TYPES.GET_STATUS }, (response: RecordingStatus) => {
            if (!chrome.runtime.lastError && response) {
                setStatus(response);
            }
        });
    };

    useEffect(() => {
        updateStatus();
        // Poll the background memory every second for the UI timer/counter ticking updates
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const startRecording = () => {
        chrome.runtime.sendMessage({ type: MESSAGE_TYPES.START_RECORDING }, () => {
            updateStatus();
        });
    };

    const stopRecording = (onSuccess: (sessionId: string) => void) => {
        chrome.runtime.sendMessage({ type: MESSAGE_TYPES.STOP_RECORDING }, (response) => {
            if (!chrome.runtime.lastError && response?.success) {
                onSuccess(response.sessionId);
            } else {
                console.error("Failed to sync session context:", response?.error);
            }
        });
    };

    return { status, startRecording, stopRecording };
}