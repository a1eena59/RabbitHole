// extension/entrypoints/background.ts
import { Recorder } from '../services/recorder';
import { Tracker } from '../services/tracker';
import { ApiClient } from '../services/api';
import { StorageWrapper } from '../services/storage';
import { MESSAGE_TYPES } from '../constants/messages';

export default defineBackground(() => {
  // Start active system observation listeners
  Tracker.init();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {

      case MESSAGE_TYPES.START_RECORDING:
        Recorder.start();
        sendResponse({ status: 'recording_started' });
        break;

      case MESSAGE_TYPES.STOP_RECORDING:
        const sessionPayload = Recorder.stop();

        // Asynchronously push out execution log tracking layers
        ApiClient.sendSession(sessionPayload).then((res) => {
          if (res?.sessionId) {
            StorageWrapper.saveLastSessionId(res.sessionId);
            sendResponse({ success: true, sessionId: res.sessionId });
          } else {
            sendResponse({ success: false, error: 'API transport fault' });
          }
        });
        return true; // Keep response channel alive for async await

      case MESSAGE_TYPES.GET_STATUS:
        sendResponse(Recorder.getStatus());
        break;

      case MESSAGE_TYPES.CLEAR_SESSION:
        Recorder.clear();
        StorageWrapper.clearSession().then(() => {
          sendResponse({ status: 'session_purged' });
        });
        return true;

      default:
        console.warn(`Unhandled messaging action context type received: ${message.type}`);
        sendResponse({ error: 'Unsupported system instruction command' });
    }
  });
});