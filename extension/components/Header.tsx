// extension/components/Header.tsx
import React from 'react';

export function Header() {
    return (
        <div className="flex items-center gap-2.5 border-b border-[#00F0FF]/20 pb-3 mb-4 select-none">
            {/* Pulls directly from the public/icon entry point */}
            <img
                src="/icon/128.png"
                alt="RabbitHole Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                    // Fallback if the image asset isn't dropped into the folder yet
                    e.currentTarget.style.display = 'none';
                }}
            />
            <h2 className="text-base font-bold font-mono text-[#00F0FF] tracking-wider">
                RABBIT HOLE
            </h2>
        </div>
    );
}