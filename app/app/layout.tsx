import type { Metadata } from 'next';
import { Shell } from '@/components/workspace/shell';

export const metadata: Metadata = {
  title: 'Workspace — Fieldwise',
};

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
