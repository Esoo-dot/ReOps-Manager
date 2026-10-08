'use client';

import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace/workspace-context';
import { type Language, tx } from '@/lib/workspace/config';
import { PageTitle, Button, MetricCard, Skeleton, QueryError, EmptyState, RecordStatus } from '@/components/workspace/primitives';
import { useGetOperationsSummary, useListOperationsRecords } from '@/lib/api/hooks';
import { type OperationsRecord } from '@/lib/api/types';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, BookOpenCheck, CalendarDays, ChevronRight, Clock3, ClipboardCheck, ClipboardList, ListTodo, Plus, Target, UsersRound } from 'lucide-react';

function Dashboard({ language, globalSearch }: { language: Language; globalSearch: string }) {
  const { data: summary, isLoading, isError, refetch } = useGetOperationsSummary();
  const { data: records, isLoading: recordsLoading, isError: recordsError, refetch: retryRecords } = useListOperationsRecords();
  const { push: setLocation } = useRouter();
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Africa/Cairo' }).format(new Date()));
  const salutation = hour < 12 ? 'Good morning' : 'Good afternoon';
  const today = new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Africa/Cairo' }).format(new Date());
  const latest = (summary?.recentActivity ?? []).filter(r => `${r.title} ${r.detail} ${r.assignee} ${r.branch}`.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 5);
  const dueSoon = (records ?? [])
    .filter(record => record.dueDate && !['complete', 'completed', 'cancelled', 'canceled'].includes(record.status.toLowerCase()))
    .sort((left, right) => (left.dueDate ?? '').localeCompare(right.dueDate ?? ''))
    .slice(0, 4);
  return <>
     <PageTitle eyebrow={`${today} · ${tx('Field operations', language)}`} title={`${tx(salutation, language)}, Amira`} subtitle="Here’s the pulse of your operation today." language={language} action={<Button onClick={() => setLocation('/app/tasks')}><Plus size={15} />{tx('Add record', language)}</Button>} />
    <section className="mb-7 overflow-hidden rounded-2xl bg-brand-strong text-primary-foreground shadow-[0_9px_28px_rgba(32,59,55,.12)]">
      <div className="relative flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:px-8 md:py-7">
        <div className="pointer-events-none absolute -right-7 -top-16 size-64 rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-1 top-2 size-40 rounded-full border border-white/10" />
         <div className="relative"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-brass"><span className="size-1.5 rounded-full bg-[#e3bd7d]" />Live operations brief</div><h2 className="font-[var(--app-font-serif)] text-[23px] font-bold tracking-[-.035em] md:text-[27px]">{tx('A steady start across the network.', language)}</h2><p className="mt-2 max-w-lg text-[12px] leading-5 text-[#f5f1e8]/65">{tx('Your teams are making progress. Use the live indicators below to see where support is needed.', language)}</p></div>
        <button onClick={() => setLocation('/app/performance')} className="relative inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brass px-4 text-xs font-bold text-brand-ink hover:bg-brass/80">View field report<ArrowRight size={15} /></button>
      </div>
    </section>
    <div className="mb-3 flex items-center justify-between"><h2 className="text-[12px] font-bold">{tx('Today at a glance', language)}</h2><button onClick={() => setLocation('/app/performance')} className="text-[10px] font-semibold text-primary hover:underline">View reports <ArrowRight size={12} className="inline" /></button></div>
    {isLoading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[126px] animate-pulse rounded-xl border border-border bg-card" />)}</div> : isError || !summary ? <QueryError retry={() => refetch()} /> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
       <MetricCard label={tx('Team members', language)} value={summary.employees} note={tx('Active roster', language)} icon={UsersRound} accent="#507d69" />
       <MetricCard label={tx('Open tasks', language)} value={summary.tasksOpen} note={tx('Across all branches', language)} icon={ListTodo} accent="#c28a3c" />
       <MetricCard label={tx('Open requests', language)} value={summary.requestsOpen} note={tx('Current queue', language)} icon={ClipboardList} accent="#b56c52" />
       <MetricCard label={tx('Training completion', language)} value={`${summary.trainingCompletion}%`} note={tx('Team average', language)} icon={BookOpenCheck} accent="#6689a0" progress={summary.trainingCompletion} />
    </div>}
    <div className="mt-7 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-[13px] font-bold">{tx('Recent activity', language)}</h2><p className="mt-1 text-[10px] text-muted-foreground">The latest movement across your teams</p></div><button onClick={() => setLocation('/app/tasks')} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold hover:bg-muted">View all</button></div>
        {recordsLoading ? <Skeleton rows={4} /> : recordsError ? <QueryError retry={() => retryRecords()} /> : latest.length ? <div className="divide-y divide-border/70">{latest.map((record, i) => <ActivityRow key={record.id} record={record} index={i} />)}</div> : <EmptyState language={language} search={!!globalSearch} />}
      </section>
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-[13px] font-bold">{tx('Due soon', language)}</h2><p className="mt-1 text-[10px] text-muted-foreground">Keep an eye on the next handoff</p></div><CalendarDays size={17} className="text-muted-foreground" /></div>
        {recordsLoading ? <Skeleton rows={3} /> : recordsError ? <QueryError retry={() => retryRecords()} /> : dueSoon.length ? <div className="space-y-2.5">{dueSoon.map(r => <div key={r.id} className="flex items-center gap-3 rounded-lg bg-background px-3 py-3"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-brass-soft text-brass"><Clock3 size={15} /></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{r.title}</div><div className="mt-1 text-[10px] text-muted-foreground">{r.branch || 'Unassigned branch'} · {r.dueDate}</div></div><span className="size-2 rounded-full" style={{ backgroundColor: r.priority.toLowerCase() === 'high' ? '#c76c4c' : '#c5a250' }} /></div>)}</div> : <EmptyState language={language} action={() => setLocation('/app/tasks')} />}
      </section>
    </div>
    {!isLoading && summary && <section className="mt-5 grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-[1fr_auto] md:items-center md:px-6"><div><div className="flex items-center gap-2 text-[12px] font-bold"><Target size={16} className="text-primary" />Performance pulse</div><p className="mt-1 text-[10px] text-muted-foreground">Target achievement across active branch KPIs</p></div><div className="flex items-center gap-3"><div className="h-2 w-40 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-[#588a71]" style={{ width: `${summary.kpiAchievement}%` }} /></div><strong className="text-sm">{summary.kpiAchievement}%</strong><ArrowUpRight size={15} className="text-primary" /></div></section>}
  </>;
}
function ActivityRow({ record, index }: { record: OperationsRecord; index: number }) {
  const Icon = record.kind === 'request' ? ArrowDownLeft : record.kind === 'employee' ? UsersRound : record.kind === 'training' ? BookOpenCheck : ClipboardCheck;
  const colors = ['#e9eee7', '#f6ead5', '#f5e8e2', '#e5edf0', '#ede8f2'];
  return <div className="flex items-center gap-3 py-3.5" data-testid={`activity-record-${record.id}`}><div className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ color: ['#507d69', '#a67b38', '#ac684f', '#577f91', '#776a8c'][index % 5], backgroundColor: colors[index % 5] }}><Icon size={16} /></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{record.title}</div><div className="mt-1 truncate text-[10px] text-muted-foreground">{record.assignee || record.department || 'Operations'}{record.branch ? ` · ${record.branch}` : ''}</div></div><div className="hidden text-right sm:block"><RecordStatus status={record.status} /><div className="mt-1.5 text-[9px] text-muted-foreground">{record.createdAt?.slice(0, 10)}</div></div><ChevronRight size={15} className="text-muted-foreground/70" /></div>;
}

export function DashboardView() {
  const { language, search } = useWorkspace();
  return <Dashboard language={language} globalSearch={search} />;
}
