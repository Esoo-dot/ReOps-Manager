'use client';

import { createContext, useContext } from 'react';
import type { Language } from '@/lib/workspace/config';

type WorkspaceContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  search: string;
  branchCount: number;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used inside the workspace Shell');
  return context;
}
