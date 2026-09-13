import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

const PULL_THRESHOLD = 70;
const MAX_PULL = 110;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 2 && !isRefreshing) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || startYRef.current === null || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      if (diff > 0 && window.scrollY <= 2) {
        // Apply rubber-band damping
        const damped = Math.min(MAX_PULL, diff * 0.45);
        setPullY(damped);
      } else {
        setPullY(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      startYRef.current = null;

      if (pullY >= PULL_THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        setPullY(52); // Hold at active spinner height
        try {
          await onRefresh();
        } finally {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullY(0);
          }, 600);
        }
      } else {
        setPullY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullY, isRefreshing, onRefresh]);

  const progress = Math.min(1, pullY / PULL_THRESHOLD);
  const rotation = isRefreshing ? 360 : progress * 360;

  return (
    <div className="relative">
      {/* Animated Pull indicator pill */}
      <div
        style={{
          transform: `translate3d(-50%, ${pullY - 48}px, 0)`,
          opacity: pullY > 10 || isRefreshing ? 1 : 0,
        }}
        className="fixed left-1/2 z-50 pointer-events-none transition-transform duration-100 ease-out flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
      >
        <RefreshCw
          style={{ transform: isRefreshing ? undefined : `rotate(${rotation}deg)` }}
          className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${
            isRefreshing ? 'animate-spin-smooth' : 'transition-transform duration-75'
          }`}
        />
        <span>{isRefreshing ? 'Refreshing...' : pullY >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull down'}</span>
      </div>

      {children}
    </div>
  );
};
