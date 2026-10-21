import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuditEntry } from '@/types/dashboard.types';
import { generateId } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { safeStorage } from '@/lib/safe-storage';

interface AuditState {
  entries: AuditEntry[];
  logAction: (action: string, details: string, resource?: string) => void;
  getEntries: () => AuditEntry[];
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      entries: [],

      logAction: (action, details, resource = 'system') => {
        const user = useAuthStore.getState().user;
        const entry: AuditEntry = {
          id: generateId('audit'),
          action,
          userId: user?.id ?? 'system',
          userName: user?.name ?? 'System',
          userRole: user?.role ?? 'system',
          resource,
          details,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ entries: [entry, ...state.entries].slice(0, 200) }));
      },

      getEntries: () => get().entries,
    }),
    {
      name: 'audit-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
