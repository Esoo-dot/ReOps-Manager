import type { Metadata } from 'next';
import { Shell } from '@/components/workspace/shell';

export const metadata: Metadata = {
  title: 'Workspace — ReOps Manager',
};

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
