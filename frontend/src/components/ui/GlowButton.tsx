// frontend/src/components/ui/GlowButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

// Pull from Framer Motion's safe button props instead of standard HTML attributes
interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export function GlowButton({ children, variant = 'primary', className = '', ...props }: GlowButtonProps) {
    // Extract native attributes that clash with Framer Motion's type definitions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...safeProps } = props;

    if (variant === 'secondary') {
        return (
            <motion.button
                className={`px-6 py-3 font-mono text-sm font-semibold text-text-secondary border border-white/10 rounded-[14px] hover:border-accent-cyan/40 hover:text-text-primary transition-all active:scale-[0.98] cursor-pointer ${className}`}
                {...safeProps}
            >
                {children}
            </motion.button>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0, 245, 255, 0.25)' }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-mono text-sm font-bold text-bg-deep bg-gradient-to-r from-[#00F5FF] to-[#4ADEDE] rounded-[14px] transition-shadow cursor-pointer ${className}`}
            {...safeProps} // Spread only the motion-compatible parameters
        >
            {children}
        </motion.button>
    );
}