import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showRestored) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 p-4 rounded-xl shadow-2xl border transition-all duration-300 ${
        isOffline
          ? 'bg-[#B85C4A]/95 text-white border-red-500/40 backdrop-blur-md animate-bounce-subtle'
          : 'bg-[#2E5C4D]/95 text-white border-emerald-500/40 backdrop-blur-md animate-fade-in'
      }`}
    >
      <div className="flex items-center gap-3">
        {isOffline ? (
          <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-5 h-5 text-white animate-pulse" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {isOffline ? 'Connection Lost (Offline Mode)' : 'Connection Restored'}
          </p>
          <p className="text-xs text-white/80 mt-0.5">
            {isOffline
              ? 'New seat reservations require internet. Previously viewed tickets remain cached.'
              : 'You are back online. Real-time seat updates and booking services are active.'}
          </p>
        </div>
      </div>
    </div>
  );
}
