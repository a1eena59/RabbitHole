// extension/entrypoints/popup/App.tsx
import React from 'react';
import { useRecorder } from '../../hooks/useRecorder';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { Stats } from '../../components/Stats';
import { RecorderButton } from '../../components/RecorderButton';

export default function App() {
  const { status, startRecording, stopRecording } = useRecorder();
  // extension/entrypoints/popup/App.tsx

  const handleSessionStop = (sessionId: string) => {
    // Read the configuration based on compilation runtime modes
    const baseUrl = import.meta.env.WXT_FRONTEND_URL || "http://localhost:5173";

    chrome.tabs.create({ url: `${baseUrl}/sessions/${sessionId}` });
  };
  return (
    <div className="w-[300px] p-4 bg-[#070A1E] border border-[#00F0FF]/10 select-none overflow-hidden">
      <Header />
      <div className="flex justify-end mb-4">
        <StatusBadge isRecording={status.isRecording} />
      </div>
      <Stats
        duration={status.duration}
        eventCount={status.eventCount}
        uniqueTabsCount={status.uniqueTabsCount}
      />
      <RecorderButton
        isRecording={status.isRecording}
        onStart={startRecording}
        onStop={() => stopRecording(handleSessionStop)}
      />
    </div>
  );
}