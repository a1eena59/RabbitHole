// frontend/src/components/ui/GlassCard.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`relative overflow-hidden bg-white/[0.08] backdrop-blur-[20px] border border-white/[0.1] rounded-[20px] shadow-[0_0_30px_rgba(0,0,0,0.25)] ${className}`}
        >
            {/* Dynamic Cursor Spotlight Effect */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 transition-opacity duration-300"
                    style={{
                        width: '250px',
                        height: '250px',
                        background: 'radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, rgba(124, 58, 237, 0.02) 50%, transparent 70%)',
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                    }}
                />
            )}
            <div className="relative z-10 h-full w-full">{children}</div>
        </motion.div>
    );
}