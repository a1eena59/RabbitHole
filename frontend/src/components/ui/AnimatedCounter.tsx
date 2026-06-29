import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export function AnimatedCounter({ from = 0, to, duration = 1.2 }: { from?: number; to: number; duration?: number }) {
    const [count, setCount] = useState(from);

    useEffect(() => {
        const controls = animate(from, to, {
            duration,
            ease: 'easeOut',
            onUpdate: (val) => setCount(Math.floor(val)),
        });
        return () => controls.stop();
    }, [from, to, duration]);

    return <span>{count}</span>;
}