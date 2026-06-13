import { useContext } from 'react';
import { AppContext } from './store';
import type { AppContextType } from './store';

export type { AppContextType };

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useMandalName(mandalId: string): string {
  const { data } = useApp();
  return data.mandals.find((m) => m.id === mandalId)?.name ?? mandalId;
}
