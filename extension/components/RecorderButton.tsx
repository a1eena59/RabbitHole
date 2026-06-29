// extension/components/RecorderButton.tsx
import React from 'react';

interface RecorderButtonProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
}

export function RecorderButton({ isRecording, onStart, onStop }: RecorderButtonProps) {
    if (!isRecording) {
        return (
            <button
                onClick={onStart}
                className="w-full py-2.5 font-mono text-xs font-bold text-[#00F0FF] border border-[#00F0FF] bg-transparent rounded hover:bg-[#00F0FF]/10 active:scale-[0.98] transition cursor-pointer select-none"
            >
                Go Down the Rabbit Hole
            </button>
        );
    }

    return (
        <button
            onClick={onStop}
            className="w-full py-2.5 font-mono text-xs font-bold text-white bg-[#FF007F] rounded shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:bg-[#FF007F]/90 active:scale-[0.98] transition cursor-pointer select-none"
        >
            Climb Out (Stop)
        </button>
    );
}