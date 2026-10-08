import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecordsView } from '@/components/workspace/records-page';
import { pageMeta } from '@/lib/workspace/config';

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return Object.keys(pageMeta).map(path => ({ section: path.replace('/app/', '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = pageMeta[`/app/${(await params).section}`];
  return { title: meta ? `${meta.title} — ReOps Manager` : 'Not found — ReOps Manager' };
}

export default async function SectionPage({ params }: Props) {
  const path = `/app/${(await params).section}`;
  if (!pageMeta[path]) notFound();
  return <RecordsView path={path} />;
}
