import type { Metadata } from 'next';
import { SettingsView } from '@/components/workspace/settings-page';

export const metadata: Metadata = { title: 'Settings — ReOps Manager' };

export default function SettingsPage() {
  return <SettingsView />;
}
