// extension/components/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
    isRecording: boolean;
}

export function StatusBadge({ isRecording }: StatusBadgeProps) {
    return (
        <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isRecording ? 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]' : 'bg-[#FF007F]'}`} />
            <span style={{ color: isRecording ? '#39FF14' : '#FF007F' }}>
                {isRecording ? 'RECORDING' : 'STANDBY'}
            </span>
        </div>
    );
}