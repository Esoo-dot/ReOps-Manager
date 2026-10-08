'use client';

import { type ReactNode } from 'react';
import { type Language, tx, cx } from '@/lib/workspace/config';
import { CircleHelp, ClipboardCheck, Plus, Search, RefreshCw, type LucideIcon } from 'lucide-react';

export function PageTitle({ eyebrow, title, subtitle, action, language }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode; language: Language }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-4 page-enter"><div><div className="mb-2 text-[10px] font-bold tracking-[.18em] text-primary">{tx(eyebrow, language)}</div><h1 className="font-[var(--app-font-serif)] text-[34px] font-extrabold leading-none tracking-[-.05em] md:text-[40px]">{tx(title, language)}</h1><p className="mt-3 text-[13px] text-muted-foreground">{tx(subtitle, language)}</p></div>{action}</div>;
}
export function Button({ children, onClick, variant = 'primary', testId, type = 'button', disabled = false }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'subtle' | 'outline'; testId?: string; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={cx('inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[12px] font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-50', variant === 'primary' ? 'bg-primary text-primary-foreground shadow-sm hover:brightness-95' : variant === 'outline' ? 'border border-border bg-card text-foreground hover:bg-muted' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>{children}</button>;
}
export function MetricCard({ label, value, note, icon: Icon, accent, progress }: { label: string; value: string | number; note?: string; icon: LucideIcon; accent: string; progress?: number }) {
  return <article className="rounded-xl border border-border/90 bg-card p-4 shadow-[0_2px_8px_rgba(35,51,54,.025)] md:p-5" data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-muted-foreground">{label}</span><div className="grid size-8 place-items-center rounded-lg" style={{ backgroundColor: `${accent}18`, color: accent }}><Icon size={16} /></div></div>
     <div className="mt-4 flex items-end justify-between"><strong className="font-[var(--app-font-serif)] text-[30px] font-extrabold leading-none tracking-[-.05em]">{value}</strong>{note && <span className="mb-0.5 text-[10px] font-medium text-muted-foreground">{note}</span>}</div>
    {progress !== undefined && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${Math.min(100, progress)}%`, backgroundColor: accent }} /></div>}
  </article>;
}
export function Skeleton({ rows = 3 }: { rows?: number }) {
  return <div className="space-y-3" aria-label="Loading records">{Array.from({ length: rows }).map((_, i) => <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border border-border bg-card p-4"><div className="size-9 rounded-lg bg-muted" /><div className="flex-1 space-y-2"><div className="h-3 w-1/3 rounded bg-muted" /><div className="h-2.5 w-1/2 rounded bg-muted" /></div><div className="h-6 w-16 rounded-full bg-muted" /></div>)}</div>;
}
export function QueryError({ retry }: { retry: () => void }) {
  return <div className="rounded-xl border border-[#e8c5b9] bg-[#fff8f4] p-6 text-center"><div className="mx-auto grid size-10 place-items-center rounded-full bg-[#f7e5dd] text-[#a65c43]"><CircleHelp size={19} /></div><h3 className="mt-3 text-sm font-bold">Could not load workspace data</h3><p className="mt-1 text-xs text-muted-foreground">Please try again. Your work is still here.</p><Button variant="outline" onClick={retry}><RefreshCw size={14} />Retry</Button></div>;
}
export function EmptyState({ action, language, search = false }: { action?: () => void; language: Language; search?: boolean }) {
  return <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e9eee7] text-primary">{search ? <Search size={21} /> : <ClipboardCheck size={21} />}</div><h3 className="mt-4 text-sm font-bold">{tx(search ? 'Nothing matches your search' : 'No records yet', language)}</h3><p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{tx(search ? 'Try a different search or clear the current filter.' : 'Create your first record to get this workspace moving.', language)}</p>{action && !search && <div className="mt-5"><Button onClick={action}><Plus size={15} />{tx('Add record', language)}</Button></div>}</div>;
}
export function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value.includes('complete') || value.includes('active') || value.includes('approved') || value.includes('on track')) return 'bg-[#e6f1e9] text-[#3d7453]';
  if (value.includes('progress') || value.includes('review') || value.includes('pending') || value.includes('scheduled')) return 'bg-[#f8efd9] text-[#95712e]';
  if (value.includes('block') || value.includes('urgent') || value.includes('overdue') || value.includes('declined')) return 'bg-[#f8e8e2] text-[#a75b45]';
  return 'bg-muted text-muted-foreground';
}
export function RecordStatus({ status }: { status: string }) { return <span className={cx('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize', statusTone(status))}>{status || 'Open'}</span>; }
