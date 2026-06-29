// extension/components/Stats.tsx
import React from 'react';
import { formatDuration } from '../utils/format';

interface StatsProps {
    duration: number;
    eventCount: number;
    uniqueTabsCount: number;
}

export function Stats({ duration, eventCount, uniqueTabsCount }: StatsProps) {
    return (
        <div className="space-y-2 mb-5 text-[13px] font-mono text-[#E8E8E8]">
            <div className="flex justify-between border-b border-[#111636] py-1">
                <span className="text-gray-400">Time Elapsed:</span>
                <span className="text-[#00F0FF] font-bold">{formatDuration(duration)}</span>
            </div>
            <div className="flex justify-between border-b border-[#111636] py-1">
                <span className="text-gray-400">Pages Sampled:</span>
                <span className="text-[#00F0FF]">{eventCount}</span>
            </div>
            <div className="flex justify-between border-b border-[#111636] py-1">
                <span className="text-gray-400">Active Nodes:</span>
                <span className="text-[#00F0FF]">{uniqueTabsCount}</span>
            </div>
        </div>
    );
}